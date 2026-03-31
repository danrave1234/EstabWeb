/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import TemplateGenerationActivityLog from "@/components/shared/TemplateGenerationActivityLog";
import {
  buildTemplateGenerationSummary,
  createTemplateGenerationLogEntries,
  failTemplateGenerationLogEntries,
  setActiveTemplateGenerationLogEntry,
} from "@/lib/utils/template-generation-activity";

describe("template generation activity", () => {
  it("builds staged logs for business-page and uploaded-image runs", () => {
    const entries = createTemplateGenerationLogEntries({
      useSearch: true,
      businessPageUrl: "https://www.facebook.com/shineautospa",
      businessImageName: "logo-screenshot.png",
    });

    expect(entries.map((entry) => entry.id)).toEqual([
      "prepare",
      "scrape",
      "search",
      "vision",
      "plan",
      "generate",
      "assets",
      "apply",
    ]);
    expect(entries[0].status).toBe("active");
    expect(entries.slice(1).every((entry) => entry.status === "pending")).toBe(true);
  });

  it("summarizes grounded research and image compilation from the API response", () => {
    const summary = buildTemplateGenerationSummary(
      {
        sources: ["https://example.com/a", "https://example.com/b"],
        searchEnabled: true,
        businessPageUrl: "https://www.facebook.com/shineautospa",
        usedInlineImage: true,
        pageSignals: {
          pagePhotos: ["1", "2", "3"],
          recentPosts: [{ imageUrl: "4" }],
        },
        activeSections: ["hero", "gallery--grid", "contact"],
      },
      {
        useSearch: true,
        businessImageName: "logo-screenshot.png",
      },
    );

    expect(summary).toEqual(
      expect.arrayContaining([
        "Reviewed the linked business page for public branding, contact, and media signals.",
        "Used grounded web research and kept 2 sources in the final result.",
        "Reviewed your uploaded image (logo-screenshot.png) for extra brand cues.",
        "Compiled 4 public image signals for hero and section photo suggestions.",
      ]),
    );
  });

  it("marks the active step as failed without removing completed work", () => {
    const entries = setActiveTemplateGenerationLogEntry(
      createTemplateGenerationLogEntries({ useSearch: true }),
      3,
    );

    const failed = failTemplateGenerationLogEntries(entries);

    expect(failed[0].status).toBe("success");
    expect(failed[1].status).toBe("success");
    expect(failed[2].status).toBe("success");
    expect(failed[3].status).toBe("error");
    expect(failed[4].status).toBe("pending");
  });

  it("renders the compact activity panel with live status and summary notes", () => {
    render(
      <TemplateGenerationActivityLog
        entries={setActiveTemplateGenerationLogEntry(createTemplateGenerationLogEntries({ useSearch: true }), 2)}
        summary={["Reviewed the linked business page for public branding, contact, and media signals."]}
        isRunning
      />,
    );

    expect(screen.getByTestId("template-generation-activity-log")).toBeTruthy();
    expect(screen.getByText("Generation activity")).toBeTruthy();
    expect(screen.getByText("Live")).toBeTruthy();
    expect(screen.getByText("What AI used")).toBeTruthy();
    expect(screen.getByText("Generating with AI")).toBeTruthy();
  });
});