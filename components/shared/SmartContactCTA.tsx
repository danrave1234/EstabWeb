"use client";

import React, { useState, useEffect } from "react";
import {
    Phone,
    Calendar,
    ArrowUp,
    MessageCircle,
    X,
    PhoneCall,
    MessageSquare
} from "lucide-react";
import { ChatCircleIcon, PhoneIcon, ChatCircleDotsIcon } from "@phosphor-icons/react";
import { trackEvent, trackLead, useProjectId } from "@/components/shared/Analytics";
import { cn } from "@/lib/utils";

export type SmartContactCTAProps = {
    phone?: string;
    messengerUrl?: string;
    viberNumber?: string;
    ctaText?: string;
    ctaHref?: string;
    messengerLabel?: string;
    viberLabel?: string;
    callLabel?: string;
};

export default function SmartContactCTA({
    phone,
    messengerUrl,
    viberNumber,
    ctaText = "Book Now",
    ctaHref = "#contact",
    messengerLabel = "Messenger",
    viberLabel = "Viber",
    callLabel = "Call",
}: SmartContactCTAProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const projectId = useProjectId();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
                setShowScrollTop(true);
            } else {
                setIsVisible(false);
                setShowScrollTop(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const track = (cta_id: string) => {
        trackEvent({
            type: "cta_click",
            project_id: projectId,
            section_key: "smart_cta",
            cta_id
        });
    };

    if (!phone && !messengerUrl && !viberNumber && !ctaText) return null;

    return (
        <div className={cn(
            "fixed right-3 bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:bottom-6 sm:right-6 z-[120] flex flex-col items-end gap-2 transition-all duration-500 pointer-events-none",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
            {/* Scroll to Top */}
            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border shadow-xl text-foreground hover:bg-muted transition-all hover:-translate-y-1 active:scale-95 pointer-events-auto"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </button>
            )}

            {/* Expanded Menu */}
            {isOpen && (
              <div className="flex flex-col items-end gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {viberNumber && (
                    <a
                        href={`viber://chat?number=${viberNumber.replace(/[^0-9]/g, "")}`}
                        onClick={() => { track("viber"); trackLead("viber"); }}
                        className="flex items-center gap-2 sm:gap-3 bg-[#7360f2] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/10"
                    >
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-widest">{viberLabel}</span>
                        <ChatCircleDotsIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                    </a>
                )}

                {messengerUrl && (
                    <a
                        href={messengerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { track("messenger"); trackLead("messenger"); }}
                        className="flex items-center gap-2 sm:gap-3 bg-[#0084FF] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/10"
                    >
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-widest">{messengerLabel}</span>
                        <ChatCircleIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                    </a>
                )}

                {phone && (
                    <a
                        href={`tel:${phone}`}
                        onClick={() => { track("call"); trackLead("call"); }}
                        className="flex items-center gap-2 sm:gap-3 bg-primary text-primary-foreground px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/10"
                    >
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-widest">{callLabel}</span>
                        <PhoneIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                    </a>
                )}
              </div>
            )}

            {/* Main Trigger / primary CTA Row */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Primary Booking Button - Always visible if provided */}
                <a
                    href={ctaHref}
                    onClick={() => { track("primary_booking"); trackLead("form"); }}
                    className="flex h-10 sm:h-14 max-w-[calc(100vw-7rem)] sm:max-w-none items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-primary px-3 sm:px-8 font-black text-primary-foreground shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all border border-white/10 pointer-events-auto"
                >
                    <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] whitespace-nowrap truncate">{ctaText}</span>
                </a>

                {/* Contact Selector Toggle */}
                {(phone || messengerUrl || viberNumber) && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 transform border border-white/10 text-white shrink-0",
                            isOpen
                                ? "bg-foreground text-background rotate-90"
                                : "bg-black/80 backdrop-blur-md hover:scale-110 active:scale-95",
                            "pointer-events-auto"
                        )}
                        aria-label="Toggle contact options"
                    >
                        {isOpen ? <X className="w-4 h-4 sm:w-6 sm:h-6" /> : <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" />}
                    </button>
                )}
            </div>
        </div>
    );
}
