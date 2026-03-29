"use client";
import { useEffect, useRef } from "react";
import { isPreviewContext, getOrCreateSessionId, getOrCreateVisitorId } from "@/components/shared/Analytics";

interface Props {
  projectId: string;
}

export default function SessionRecorder({ projectId }: Props) {
  const buffer = useRef<unknown[]>([]);
  const startTime = useRef<number>(Date.now());
  const flushed = useRef(false);

  useEffect(() => {
    if (isPreviewContext()) return;
    if (!projectId) return;

    let stopRecording: (() => void) | undefined;

    async function init() {
      try {
        const { record } = await import("rrweb");
        stopRecording = record({
          emit(event) {
            buffer.current.push(event);
          },
          // Mask sensitive inputs
          maskAllInputs: true,
          maskInputOptions: { password: true, email: true, tel: true },
          // Sample at 50% to reduce payload
          sampling: {
            mousemove: 50,
            scroll: 150,
          },
        });
      } catch {
        // rrweb unavailable — silently skip
      }
    }

    init();

    function flush() {
      if (flushed.current || buffer.current.length === 0) return;
      flushed.current = true;
      const payload = {
        project_id: projectId,
        session_id: getOrCreateSessionId(),
        visitor_id: getOrCreateVisitorId(),
        page_slug: window.location.pathname,
        events: buffer.current,
        duration_ms: Date.now() - startTime.current,
      };
      // Use sendBeacon for reliability on page unload
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (!navigator.sendBeacon("/api/replay", blob)) {
        fetch("/api/replay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    }

    // Flush periodically (every 30s) and on page unload
    const interval = setInterval(() => {
      if (buffer.current.length > 0 && !flushed.current) {
        const payload = {
          project_id: projectId,
          session_id: getOrCreateSessionId(),
          visitor_id: getOrCreateVisitorId(),
          page_slug: window.location.pathname,
          events: [...buffer.current],
          duration_ms: Date.now() - startTime.current,
        };
        buffer.current = [];
        fetch("/api/replay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    }, 30_000);

    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);

    return () => {
      stopRecording?.();
      clearInterval(interval);
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [projectId]);

  return null;
}
