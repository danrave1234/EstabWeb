"use client";

import { useState } from "react";
import { submitFormLead, trackEvent } from "@/components/shared/Analytics";

export type LeadCaptureFormProps = {
    formHeading: string;
    formSubmitText: string;
    formThankYouText: string;
};

export default function LeadCaptureForm({
    formHeading,
    formSubmitText,
    formThankYouText,
}: LeadCaptureFormProps) {
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);
        const result = await submitFormLead(undefined, { name: formData.name, email: formData.email }, "lead_capture");
        setIsSubmitting(false);
        if (!result.ok) {
            setSubmitError(result.error || "Something went wrong.");
            return;
        }
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "" });
        }, 3000);
    };

    return (
        <div className="flex flex-col space-y-4 sm:space-y-5 bg-muted/30 p-4 sm:p-5 rounded-2xl lg:bg-transparent lg:p-0">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground text-center lg:text-left uppercase tracking-widest text-xs">
                {formHeading}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 w-full max-w-sm mx-auto lg:mx-0">
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full min-h-[36px] sm:min-h-[44px] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all duration-200"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full min-h-[36px] sm:min-h-[44px] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all duration-200"
                />
                {submitError && (
                    <p className="text-[10px] sm:text-xs font-medium text-destructive" role="alert">{submitError}</p>
                )}
                <button
                    type="submit"
                    disabled={isSubmitted || isSubmitting}
                    onClick={() => trackEvent({ type: 'cta_click', section_key: 'footer', cta_id: 'footer_form_submit' })}
                    className="w-full min-h-[36px] sm:min-h-[44px] px-6 py-2 sm:py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-xs sm:text-base"
                >
                    {isSubmitted ? formThankYouText : isSubmitting ? "Sending…" : formSubmitText}
                </button>
            </form>
        </div>
    );
}
