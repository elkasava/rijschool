/**
 * GSAP setup — client-only, lazy imported.
 * Registers ScrollTrigger and defines custom eases.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger);

  // Expo.out feel — used for all entrance animations (CustomEase string syntax)
  // We register as named eases callable by string in .to() / .fromTo() calls
  gsap.registerEase("expoOut", (t: number) => {
    // Approximation of cubic-bezier(0.16, 1, 0.3, 1)
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  });
  gsap.registerEase("smoothOut", (t: number) => {
    // Approximation of cubic-bezier(0.25, 0.46, 0.45, 0.94)
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  });
}

export { gsap, ScrollTrigger };
