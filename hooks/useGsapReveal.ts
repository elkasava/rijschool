"use client";

import { useEffect, RefObject } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

interface RevealOptions {
  /** Y offset to start from (default 40) */
  y?: number;
  /** Opacity start (default 0) */
  opacity?: number;
  /** Animation duration in seconds (default 0.7) */
  duration?: number;
  /** Delay before animation starts (default 0) */
  delay?: number;
  /** ScrollTrigger start position (default "top 85%") */
  start?: string;
  /** Stagger for child elements — pass a CSS selector */
  staggerSelector?: string;
  /** Stagger amount in seconds (default 0.08) */
  stagger?: number;
}

/**
 * Attaches a GSAP ScrollTrigger reveal to the given ref.
 * Animates from y+opacity to natural position.
 * Cleans up on unmount.
 */
export function useGsapReveal(
  ref: RefObject<HTMLElement | null>,
  options: RevealOptions = {}
) {
  const {
    y = 40,
    opacity = 0,
    duration = 0.7,
    delay = 0,
    start = "top 85%",
    staggerSelector,
    stagger = 0.08,
  } = options;

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (staggerSelector) {
        const targets = el.querySelectorAll(staggerSelector);
        gsap.fromTo(
          targets,
          { y, opacity, willChange: "transform, opacity" },
          {
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: "expoOut",
            stagger,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { y, opacity, willChange: "transform, opacity" },
          {
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: "expoOut",
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [y, opacity, duration, delay, start, staggerSelector, stagger]); // eslint-disable-line react-hooks/exhaustive-deps
}
