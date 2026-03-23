"use client";

import AgencyContact, { AgencyContactProps } from "@/components/ui/agency-contact";
import { submitFormLead } from "@/components/shared/Analytics";

export default function AgencyContactBlock(props: AgencyContactProps) {
  return (
    <AgencyContact
      {...props}
      onFormSubmit={async (data) => {
        const result = await submitFormLead(
          undefined,
          { name: data.name, email: data.email, message: data.message },
          "contact--agency",
        );
        if (!result.ok) {
          throw new Error(result.error || "Failed to send");
        }
      }}
    />
  );
}
