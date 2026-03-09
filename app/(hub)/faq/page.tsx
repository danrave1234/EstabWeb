import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
    title: "FAQ",
    description: "Answers to common questions about EstabWeb — pricing, features, setup, domains, and support for local business websites in the Philippines.",
    alternates: {
        canonical: "https://www.estabweb.com/faq",
    },
};

export default function FaqPage() {
    return <FaqClient />;
}
