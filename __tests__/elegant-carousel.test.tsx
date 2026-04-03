/**
 * @jest-environment jsdom
 */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import ElegantCarousel from "@/components/ui/elegant-carousel";

describe("ElegantCarousel", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps all slide images mounted so carousel navigation does not recreate image elements", () => {
    const slides = [
      {
        title: "Slide One",
        subtitle: "One",
        description: "First slide",
        accent: "#111111",
        imageUrl: "/assets/slide-1.jpg",
      },
      {
        title: "Slide Two",
        subtitle: "Two",
        description: "Second slide",
        accent: "#222222",
        imageUrl: "/assets/slide-2.jpg",
      },
      {
        title: "Slide Three",
        subtitle: "Three",
        description: "Third slide",
        accent: "#333333",
        imageUrl: "/assets/slide-3.jpg",
      },
    ];

    const { container } = render(<ElegantCarousel slides={slides} />);

    const images = container.querySelectorAll("img");

    expect(images).toHaveLength(slides.length);
    expect(container.querySelector('img[alt="Slide One"]')).toBeTruthy();
    expect(container.querySelector('img[alt="Slide Two"]')).toBeTruthy();
    expect(container.querySelector('img[alt="Slide Three"]')).toBeTruthy();
    expect(images[0]?.getAttribute("loading")).toBe("eager");
    expect(images[1]?.getAttribute("loading")).toBe("lazy");
    expect(screen.getByRole("img", { name: "Slide One" })).toBeTruthy();
  });
});