"use client";

import { ChatCircleIcon, PhoneIcon, ChatCircleDotsIcon } from "@phosphor-icons/react";

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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {viberNumber && (
        <a
          href={`viber://chat?number=${viberNumber.replace(/[^0-9]/g, "")}`}
          className="pointer-events-auto flex items-center gap-3 bg-[#7360f2] text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="text-sm font-bold hidden sm:inline">{viberLabel}</span>
          <ChatCircleDotsIcon weight="duotone" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </a>
      )}
      
      {messengerUrl && (
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-3 bg-[#0084FF] text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="text-sm font-bold hidden sm:inline">{messengerLabel}</span>
          <ChatCircleIcon weight="duotone" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </a>
      )}

      {phone && (
        <a
          href={`tel:${phone}`}
          className="pointer-events-auto flex items-center gap-3 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border-2 border-white/20"
        >
          <span className="text-sm font-bold hidden sm:inline">{callLabel}</span>
          <PhoneIcon weight="duotone" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </a>
      )}
    </div>
  );
}
