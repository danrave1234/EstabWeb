/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import nextConfig from "@/next.config";
import Header from "@/components/shared/Header";
import SimpleFooter from "@/components/blocks/SimpleFooter";
import AgencyProductGrid from "@/components/ui/agency-products";
import PhotoGalleryGrid from "@/components/blocks/PhotoGalleryGrid";
import { AgencyContact } from "@/components/ui/agency-contact";
import { AnimatedTestimonialsCommunity } from "@/components/ui/animated-testimonials-community";

jest.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ href, children, ...props }: any) => React.createElement("a", { href, ...props }, children),
  };
});

jest.mock("next/image", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ src, alt, ...props }: any) => React.createElement("img", { src, alt, ...props }),
  };
});

jest.mock("framer-motion", () => {
  const React = require("react");

  const createMotionComponent = (tag: string) =>
    React.forwardRef(({ children, layout, initial, animate, exit, transition, whileHover, whileInView, viewport, ...props }: any, ref) =>
      React.createElement(tag, { ref, ...props }, children),
    );

  return {
    __esModule: true,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
    motion: {
      div: createMotionComponent("div"),
      span: createMotionComponent("span"),
      h2: createMotionComponent("h2"),
      p: createMotionComponent("p"),
      button: createMotionComponent("button"),
    },
    useAnimation: () => ({ start: jest.fn() }),
    useInView: () => true,
  };
});

jest.mock("@/components/shared/Analytics", () => ({
  trackEvent: jest.fn(),
  trackLead: jest.fn(),
}));

jest.mock("@/components/shared/DynamicIcon", () => ({
  __esModule: true,
  default: () => null,
}));

function getDuplicateKeyErrors(spy: jest.SpyInstance) {
  return spy.mock.calls
    .flat()
    .map((value) => String(value))
    .filter((message) => message.toLowerCase().includes("same key"));
}

function getEmptySrcErrors(spy: jest.SpyInstance) {
  return spy.mock.calls
    .flat()
    .map((value) => String(value))
    .filter((message) => message.includes('An empty string ("") was passed to the src attribute'));
}

describe("runtime UI guards", () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it("allows both placeholder image hosts used by seeded content", () => {
    const remotePatterns = nextConfig.images?.remotePatterns ?? [];
    const hostnames = remotePatterns.map((pattern) => pattern.hostname);

    expect(hostnames).toContain("placehold.co");
    expect(hostnames).toContain("via.placeholder.com");
  });

  it("does not emit duplicate key warnings when header navigation labels are blank", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      React.createElement(Header, {
        brandName: "EstabWeb",
        navigation: [
          { name: "", href: "#about" },
          { name: "", href: "#contact" },
        ],
      }),
    );

    expect(getDuplicateKeyErrors(errorSpy)).toHaveLength(0);
  });

  it("does not emit duplicate key warnings when footer links have blank href values", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      React.createElement(SimpleFooter, {
        brandName: "EstabWeb",
        tagline: "Professional websites for local businesses.",
        navigation: [
          { name: "About", href: "" },
          { name: "Contact", href: "" },
        ],
        contact: {
          email: "hello@example.com",
          phone: "+63 900 000 0000",
          address: "Makati City",
        },
        social: {},
        privacyUrl: "/privacy",
        termsUrl: "/terms",
        cookieUrl: "/cookies",
      }),
    );

    expect(getDuplicateKeyErrors(errorSpy)).toHaveLength(0);
  });

  it("does not crash when header or footer navigation entries contain undefined fields", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(
        React.createElement(Header, {
          brandName: "EstabWeb",
          navigation: [
            { name: undefined, href: "#about" },
            { name: "Contact", href: undefined },
          ] as any,
        }),
      );
    }).not.toThrow();

    expect(() => {
      render(
        React.createElement(SimpleFooter, {
          brandName: "EstabWeb",
          tagline: "Professional websites for local businesses.",
          navigation: [
            { name: undefined, href: "#about" },
            { name: "Contact", href: undefined },
          ] as any,
          contact: {
            email: "hello@example.com",
            phone: "+63 900 000 0000",
            address: "Makati City",
          },
          social: {},
          privacyUrl: "/privacy",
          termsUrl: "/terms",
          cookieUrl: "/cookies",
        }),
      );
    }).not.toThrow();

    expect(getDuplicateKeyErrors(errorSpy)).toHaveLength(0);
  });

  it("does not emit duplicate key warnings when agency products receive blank duplicate categories and ids", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      React.createElement(AgencyProductGrid, {
        categories: ["", ""],
        items: [
          {
            id: "",
            name: "Shimano Tourney",
            price: "₱1,999",
            description: "Entry-level shifter set",
            image: "",
            category: "",
          },
          {
            id: "",
            name: "Shimano Altus",
            price: "₱2,499",
            description: "Durable trail-ready shifter set",
            image: "",
            category: "",
          },
        ],
      }),
    );

    expect(getDuplicateKeyErrors(errorSpy)).toHaveLength(0);
  });

  it("does not crash when agency products receive undefined string fields", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(
        React.createElement(AgencyProductGrid, {
          categories: ["All", undefined] as any,
          items: [
            {
              id: undefined,
              name: "Shimano Tourney",
              price: "₱1,999",
              description: "Entry-level shifter set",
              image: undefined,
              category: undefined,
            },
          ] as any,
        }),
      );
    }).not.toThrow();

    expect(getDuplicateKeyErrors(errorSpy)).toHaveLength(0);
  });

  it("does not emit empty src warnings when gallery items have blank image URLs", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      React.createElement(PhotoGalleryGrid, {
        title: "Gallery",
        subtitle: "Highlights",
        items: [
          {
            imageUrl: "",
            caption: "Completed fit-out",
            alt: "Completed fit-out photo",
          },
        ],
      }),
    );

    expect(screen.queryByRole("img", { name: "Completed fit-out photo" })).toBeNull();
    expect(getEmptySrcErrors(errorSpy)).toHaveLength(0);
  });

  it("does not emit duplicate key warnings when animated testimonials receive duplicate or blank identifiers", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      React.createElement(AnimatedTestimonialsCommunity, {
        testimonials: [
          {
            id: undefined,
            name: "Alex Rivera",
            role: "Founder",
            company: "North Studio",
            content: "The workflow is incredibly smooth.",
            rating: 5,
            avatar: "",
          },
          {
            id: undefined,
            name: "Alex Rivera",
            role: "Founder",
            company: "North Studio",
            content: "The workflow is incredibly smooth.",
            rating: 5,
            avatar: "",
          },
        ] as any,
        trustedCompanies: ["", ""],
      }),
    );

    expect(getDuplicateKeyErrors(errorSpy)).toHaveLength(0);
  });

  it("does not emit duplicate key warnings when agency contact items receive duplicate or blank identifiers", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      React.createElement(AgencyContact, {
        infoItems: [
          {
            id: undefined,
            label: "Email",
            value: "hello@example.com",
            icon: "mail",
            href: "mailto:hello@example.com",
          },
          {
            id: undefined,
            label: "Email",
            value: "hello@example.com",
            icon: "mail",
            href: "mailto:hello@example.com",
          },
        ] as any,
        socials: [
          {
            id: "",
            platform: "instagram",
            href: "#",
          },
          {
            id: "",
            platform: "instagram",
            href: "#",
          },
        ] as any,
      }),
    );

    expect(getDuplicateKeyErrors(errorSpy)).toHaveLength(0);
  });
});