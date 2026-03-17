"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MinimalHeroProps {
  brandName?: string;
  ctaText?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  footerTag?: string;
  footerHeading?: string;
  footerDesc?: string;
  className?: string;
}

export default function MinimalHero({
  brandName = "EstabWeb",
  ctaText = "Explore",
  kicker = "Introducing",
  title = "Build fast. Ship clean.",
  subtitle = "A minimal React starter focused on clarity, speed, and maintainability.",
  footerTag = "Designed for focus",
  footerHeading = "Composable. Accessible. Production-ready.",
  footerDesc = "Start with sensible defaults, ship without the noise, and scale your UI with confidence. Works across any app architecture.",
  className,
}: MinimalHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    type Particle = {
      x: number;
      y: number;
      speed: number;
      opacity: number;
      fadeDelay: number;
      fadeStart: number;
      fadingOut: boolean;
    };

    let particles: Particle[] = [];
    let raf = 0;

    const count = () => Math.floor((canvas.width * canvas.height) / 7000);

    const make = (): Particle => {
      const fadeDelay = Math.random() * 600 + 100;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() / 5 + 0.1,
        opacity: 0.7,
        fadeDelay,
        fadeStart: Date.now() + fadeDelay,
        fadingOut: false,
      };
    };

    const reset = (p: Particle) => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
      p.speed = Math.random() / 5 + 0.1;
      p.opacity = 0.7;
      p.fadeDelay = Math.random() * 600 + 100;
      p.fadeStart = Date.now() + p.fadeDelay;
      p.fadingOut = false;
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < count(); i++) particles.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) reset(p);
        if (!p.fadingOut && Date.now() > p.fadeStart) p.fadingOut = true;
        if (p.fadingOut) {
          p.opacity -= 0.008;
          if (p.opacity <= 0) reset(p);
        }
        ctx.fillStyle = `rgba(250, 250, 250, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, 0.6, Math.random() * 2 + 1);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={cn("minimal-root relative min-h-screen w-full overflow-hidden", className)}>
      <style>{`
@import url('https://fonts.cdnfonts.com/css/hubot-sans');

.minimal-root, .minimal-root * {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.minimal-root {
  --bg: #0a0a0a;
  --fg: #fafafa;
  --muted: #a1a1aa;
  --border: #27272a;
  --accent: #e5e7eb;

  background: var(--bg);
  color: var(--fg);
  font-family: 'Hubot Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
}

.minimal-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 0;
}

.minimal-brand {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg);
  font-weight: 600;
}

.minimal-cta {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

/* hero center */
.minimal-hero {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
  z-index: 5;
}
.minimal-kicker {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 14px;
}
.minimal-title {
  font-weight: 600;
  font-size: clamp(32px, 8vw, 88px);
  line-height: 0.95;
  margin: 0;
  color: var(--fg);
  text-shadow: none;
}
.minimal-subtitle {
  margin-top: 18px;
  font-size: clamp(14px, 2.2vw, 18px);
  color: var(--muted);
}

/* accent lines container */
.minimal-accent-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* base line visuals */
.minimal-hline, .minimal-vline {
  position: absolute;
  background: var(--border);
  opacity: .75;
  will-change: transform, opacity;
}

/* horizontal lines */
.minimal-hline {
  height: 1px; left: 0; right: 0;
  transform: scaleX(0);
  transform-origin: 50% 50%;
  animation: minimalDrawX 800ms cubic-bezier(.22,.61,.36,1) forwards;
}
.minimal-hline:nth-child(1){ top: 20%; animation-delay: 150ms; }
.minimal-hline:nth-child(2){ top: 50%; animation-delay: 280ms; }
.minimal-hline:nth-child(3){ top: 80%; animation-delay: 410ms; }

/* vertical lines */
.minimal-vline {
  width: 1px; top: 0; bottom: 0;
  transform: scaleY(0);
  transform-origin: 50% 0%;
  animation: minimalDrawY 900ms cubic-bezier(.22,.61,.36,1) forwards;
}
.minimal-vline:nth-child(4){ left: 20%; animation-delay: 520ms; }
.minimal-vline:nth-child(5){ left: 50%; animation-delay: 640ms; }
.minimal-vline:nth-child(6){ left: 80%; animation-delay: 760ms; }

/* subtle gradient shimmer while drawing */
.minimal-hline::after, .minimal-vline::after{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(250,250,250,.25), transparent);
  opacity:0;
  animation: minimalShimmer 900ms ease-out forwards;
}
.minimal-hline:nth-child(1)::after{ animation-delay: 150ms; }
.minimal-hline:nth-child(2)::after{ animation-delay: 280ms; }
.minimal-hline:nth-child(3)::after{ animation-delay: 410ms; }
.minimal-vline:nth-child(4)::after{ animation-delay: 520ms; }
.minimal-vline:nth-child(5)::after{ animation-delay: 640ms; }
.minimal-vline:nth-child(6)::after{ animation-delay: 760ms; }

/* keyframes */
@keyframes minimalDrawX {
  0% { transform: scaleX(0); opacity: 0; }
  60% { opacity: .9; }
  100% { transform: scaleX(1); opacity: .75; }
}
@keyframes minimalDrawY {
  0% { transform: scaleY(0); opacity: 0; }
  60% { opacity: .9; }
  100% { transform: scaleY(1); opacity: .75; }
}
@keyframes minimalShimmer {
  0% { opacity: .0; }
  30% { opacity: .25; }
  100% { opacity: 0; }
}

/* canvas */
.minimal-particleCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: .6;
}

/* footer section (copy) */
.minimal-footer {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 32px 24px;
  border-top: 1px solid var(--border);
  display: grid;
  place-items: center;
  text-align: center;
  gap: 6px;
  z-index: 10;
}
.minimal-footer .minimal-tag {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.minimal-footer .minimal-heading {
  font-size: 22px;
  font-weight: 600;
  color: var(--fg);
}
.minimal-footer .minimal-desc {
  font-size: 14px;
  color: var(--muted);
  max-width: 680px;
}
      `}</style>

      {/* Particles */}
      <canvas ref={canvasRef} className="minimal-particleCanvas" />

      <div className="minimal-topbar">
        <div className="minimal-brand">{brandName}</div>
        <div className="minimal-cta">{ctaText}</div>
      </div>

      {/* Accent Lines */}
      <div className="minimal-accent-lines">
        <div className="minimal-hline" />
        <div className="minimal-hline" />
        <div className="minimal-hline" />
        <div className="minimal-vline" />
        <div className="minimal-vline" />
        <div className="minimal-vline" />
      </div>

      {/* Hero */}
      <main className="minimal-hero">
        <div className="pointer-events-auto">
          <div className="minimal-kicker">{kicker}</div>
          <h1 className="minimal-title" dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br/>') }} />
          <p className="minimal-subtitle">{subtitle}</p>
        </div>
      </main>

      {/* Bottom content */}
      <section className="minimal-footer">
        <div className="minimal-tag">{footerTag}</div>
        <div className="minimal-heading">{footerHeading}</div>
        <p className="minimal-desc">{footerDesc}</p>
      </section>
    </section>
  );
}
