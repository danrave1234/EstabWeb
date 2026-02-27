import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message Sent",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/success",
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
