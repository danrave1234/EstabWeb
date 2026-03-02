"use client";

import React, { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  LifeBuoy,
  Bug,
  AlertCircle,
  PlusSquare,
  HelpCircle,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  X,
  Minus
} from "lucide-react";
import { useProjectId } from "@/components/shared/Analytics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type IssueType = 'bug' | 'problem' | 'template_request' | 'help' | 'other';

const issueTypes: { value: IssueType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'problem',
    label: 'Spotted a Problem',
    icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
    description: 'Something looks wrong or isn\'t working.'
  },
  {
    value: 'bug',
    label: 'Report a Bug',
    icon: <Bug className="w-4 h-4 text-red-500" />,
    description: 'Technical errors or bugs.'
  },
  {
    value: 'template_request',
    label: 'Template Request',
    icon: <PlusSquare className="w-4 h-4 text-blue-500" />,
    description: 'Need a specific business type?'
  },
  {
    value: 'help',
    label: 'Need Help',
    icon: <HelpCircle className="w-4 h-4 text-emerald-500" />,
    description: 'Questions about usage.'
  },
  {
    value: 'other',
    label: 'Other',
    icon: <MessageSquare className="w-4 h-4 text-gray-500" />,
    description: 'Anything else.'
  },
];

export default function SupportSystem({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [message, setMessage] = useState("");
  const projectId = useProjectId();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        // Optional: close on outside click like FB sometimes does if not focused
        // For now let's keep it open until explicit close to avoid frustration
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !message) {
      toast.error("Please select an issue type and provide a message.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          message,
          projectId,
          metadata: {
            url: window.location.href,
            ua: navigator.userAgent,
          }
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      toast.success("Support request submitted!");

      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedType(null);
          setMessage("");
        }, 300);
      }, 3000);

    } catch (err) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end max-w-[calc(100vw-2rem)] sm:max-w-none pointer-events-none" ref={chatRef}>
      {/* Chat Window */}
      <div
        className={cn(
          "mb-4 w-[calc(100vw-2rem)] sm:w-[350px] md:w-[400px] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right transform",
          isOpen
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-95 opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-none">Technical Support</h3>
              <p className="text-[10px] opacity-80 mt-1">Typically replies in minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[450px] overflow-y-auto bg-muted/5 p-4 custom-scrollbar">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Request Received!</h3>
              <p className="text-xs text-muted-foreground max-w-[250px]">
                We've received your request and our team will get back to you shortly via email.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 text-xs font-bold text-primary hover:underline"
              >
                Close Chat
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Support Greeting */}
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-xs text-foreground shadow-sm">
                  Hi there! 👋 How can we help you today? Please select what you're looking for:
                </div>
              </div>

              {!selectedType ? (
                <div className="grid grid-cols-1 gap-2 pl-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {issueTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-primary/5 hover:border-primary/30 transition-all text-left group w-full"
                    >
                      <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10">
                        {type.icon}
                      </div>
                      <span className="text-xs font-bold text-foreground">{type.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                  {/* User Selection Bubble */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none text-xs shadow-sm max-w-[85%]">
                      {issueTypes.find(t => t.value === selectedType)?.label}
                    </div>
                  </div>

                  {/* Bot Response */}
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <LifeBuoy className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-xs text-foreground shadow-sm">
                      Got it. Please describe your {selectedType?.replace('_', ' ')} in detail so we can help you better.
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="pl-10 space-y-3">
                    <textarea
                      autoFocus
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full min-h-[120px] p-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-xs"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => { setSelectedType(null); setMessage(""); }}
                        className="text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        Change issue type
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !message}
                        className="h-9 px-4 flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <span>Send</span>
                            <Send className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-muted/20 border-t border-border flex justify-center">
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
            Powered by EstabWeb Support
          </p>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-all duration-300 transform group relative pointer-events-auto",
          isOpen ? "rotate-90 scale-110" : "hover:scale-110 active:scale-95"
        )}
        aria-label="Toggle Support"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <LifeBuoy className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
            {!isOpen && (
              <span className="absolute right-full mr-4 px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-xl">
                Chat with us 👋
              </span>
            )}
          </>
        )}
      </button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}
