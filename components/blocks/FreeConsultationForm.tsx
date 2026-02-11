"use client";

import { useState } from "react";
import { Shield, Clock, Lock } from "lucide-react";

export type FreeConsultationFormProps = {
  headline: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  formTitle?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  dropdownLabel?: string;
  dropdownOptions: string[];
  buttonText: string;
  buttonThankYou?: string;
};

export default function FreeConsultationForm({
  headline,
  bullet1,
  bullet2,
  bullet3,
  formTitle = "Request a Consultation",
  namePlaceholder = "Full Name",
  emailPlaceholder = "Email",
  dropdownLabel = "Legal Issue",
  dropdownOptions,
  buttonText,
  buttonThankYou = "Request received.",
}: FreeConsultationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: dropdownOptions[0] ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", issue: dropdownOptions[0] ?? "" });
    }, 4000);
  };

  return (
    <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-6">
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {headline}
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">{bullet1}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">{bullet2}</span>
              </li>
              <li className="flex gap-3">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">{bullet3}</span>
              </li>
            </ul>
          </div>
          <div className="bg-background border border-border text-foreground rounded-xl p-5 sm:p-8 shadow-xl">
            <h3 className="text-lg sm:text-xl font-semibold mb-6">{formTitle}</h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
              <div>
                <label htmlFor="consult-name" className="sr-only">
                  {namePlaceholder}
                </label>
                <input
                  id="consult-name"
                  type="text"
                  required
                  placeholder={namePlaceholder}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-3 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-xs sm:text-base"
                />
              </div>
              <div>
                <label htmlFor="consult-email" className="sr-only">
                  {emailPlaceholder}
                </label>
                <input
                  id="consult-email"
                  type="email"
                  required
                  placeholder={emailPlaceholder}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-3 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-xs sm:text-base"
                />
              </div>
              <div>
                <label htmlFor="consult-issue" className="sr-only">
                  {dropdownLabel}
                </label>
                <select
                  id="consult-issue"
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, issue: e.target.value }))
                  }
                  className="w-full min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-3 rounded-lg bg-muted/30 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-xs sm:text-base"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    paddingRight: "2rem",
                  }}
                >
                  {dropdownOptions.map((opt) => (
                    <option key={opt} value={opt} className="text-foreground bg-background">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full min-h-[40px] sm:min-h-[44px] py-2 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 disabled:opacity-70 transition-opacity text-sm sm:text-lg touch-manipulation"
              >
                {submitted ? buttonThankYou : buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
