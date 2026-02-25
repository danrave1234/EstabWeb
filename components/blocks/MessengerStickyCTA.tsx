"use client";

import { ChatCircleIcon, PhoneIcon, ChatCircleDotsIcon } from "@phosphor-icons/react";
import { trackLead, trackEvent } from "@/components/shared/Analytics";

export type MessengerStickyCTAProps = {
  messengerUrl?: string;
  viberNumber?: string;
  phone?: string;
  messengerLabel?: string;
  viberLabel?: string;
  callLabel?: string;
};

export default function MessengerStickyCTA({
  messengerUrl,
  viberNumber,
  phone,
  messengerLabel = "Chat on Messenger",
  viberLabel = "Book via Viber",
  callLabel = "Call Now",
}: MessengerStickyCTAProps) {
  if (!messengerUrl && !viberNumber && !phone) return null;
  const track = (cta_id: string) => trackEvent({ type: 'cta_click', section_key: 'sticky_cta', cta_id });

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 z-50 flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-3 pointer-events-none"
    >
      {viberNumber && (
        <a
          href={`viber://chat?number=${viberNumber.replace(/[^0-9]/g, "")}`}
          onClick={() => { track('sticky_viber'); trackLead('viber'); }}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-[#7360f2] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="text-xs sm:text-sm font-bold hidden sm:inline">{viberLabel}</span>
          <ChatCircleDotsIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
        </a>
      )}
      
      {messengerUrl && (
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { track('sticky_messenger'); trackLead('messenger'); }}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-[#0084FF] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="text-xs sm:text-sm font-bold hidden sm:inline">{messengerLabel}</span>
          <ChatCircleIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
        </a>
      )}

      {phone && (
        <a
          href={`tel:${phone}`}
          onClick={() => { track('sticky_call'); trackLead('call'); }}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-primary text-primary-foreground px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border-2 border-white/20"
        >
          <span className="text-xs sm:text-sm font-bold hidden sm:inline">{callLabel}</span>
          <PhoneIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
        </a>
      )}
    </div>
  );
}
