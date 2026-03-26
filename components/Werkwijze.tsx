"use client";

import { useRef, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Car,
  Award,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import content from "@/data/content.json";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

const iconMap: Record<string, LucideIcon> = { Car, BookOpen, GraduationCap, Award };
const stappen = content.werkwijze.map((s) => ({ ...s, icon: iconMap[s.icon] ?? Car }));

const colorMap: Record<string, { ring: string; bg: string; icon: string; dot: string; badge: string }> = {
  indigo: {
    ring: "border-brand-600",
    bg: "bg-brand-600/10",
    icon: "text-brand-400",
    dot: "bg-brand-600",
    badge: "bg-brand-600/20 text-brand-300",
  },
  violet: {
    ring: "border-violet-500",
    bg: "bg-violet-500/10",
    icon: "text-violet-400",
    dot: "bg-violet-500",
    badge: "bg-violet-500/20 text-violet-300",
  },
  sky: {
    ring: "border-sky-500",
    bg: "bg-sky-500/10",
    icon: "text-sky-400",
    dot: "bg-sky-500",
    badge: "bg-sky-500/20 text-sky-300",
  },
  emerald: {
    ring: "border-emerald-500",
    bg: "bg-emerald-500/10",
    icon: "text-emerald-400",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
};

export default function Werkwijze() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Header dramatic reveal
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expoOut",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Timeline line draw from top to bottom
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: stepsContainerRef.current,
              start: "top 80%",
              once: true,
            },
            delay: 0.2,
          }
        );
      }

      // Steps: alternating left/right slide-in
      const stepEls = stepsContainerRef.current?.querySelectorAll("[data-step]");
      if (stepEls && stepEls.length > 0) {
        stepEls.forEach((el, i) => {
          const xDir = i % 2 === 0 ? -40 : 40;
          gsap.fromTo(
            el,
            { x: xDir, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              ease: "expoOut",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
              delay: 0.05,
            }
          );

          // Step number count-up animation
          const numEl = el.querySelector("[data-step-num]");
          if (numEl) {
            const originalText = numEl.textContent ?? "";
            const numMatch = originalText.match(/\d+/);
            if (numMatch) {
              const target = parseInt(numMatch[0], 10);
              const prefix = originalText.split(numMatch[0])[0];
              const suffix = originalText.split(numMatch[0])[1] ?? "";
              const counter = { val: 0 };
              gsap.to(counter, {
                val: target,
                duration: 0.8,
                ease: "power2.out",
                onUpdate: () => {
                  if (numEl) numEl.textContent = `${prefix}${Math.round(counter.val).toString().padStart(2, "0")}${suffix}`;
                },
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  once: true,
                },
                delay: 0.15,
              });
            }
          }
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="werkwijze" className="py-12 sm:py-20 lg:py-28 bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          style={{ opacity: 0 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Onze werkwijze
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Van eerste les tot rijbewijs
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Een duidelijk en bewezen stappenplan dat jou zo efficiënt mogelijk
            naar je rijbewijs brengt.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — GSAP draw animation */}
          <div
            ref={timelineLineRef}
            className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-600 via-slate-700 to-emerald-500 hidden sm:block"
            style={{ transformOrigin: "top center" }}
          />

          <div ref={stepsContainerRef} className="space-y-8">
            {stappen.map((stap, i) => {
              const c = colorMap[stap.color];
              const Icon = stap.icon;
              const isLast = i === stappen.length - 1;

              return (
                <div
                  key={stap.nummer}
                  data-step
                  style={{ opacity: 0 }}
                  className="relative flex gap-6 sm:gap-10"
                >
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-2xl border-2 ${c.ring} ${c.bg} flex items-center justify-center z-10 relative`}
                    >
                      <Icon className={`w-7 h-7 ${c.icon}`} />
                    </div>
                    {!isLast && (
                      <div className="sm:hidden w-px flex-1 bg-slate-700 mt-2 mb-0 min-h-[2rem]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        data-step-num
                        className="text-slate-300 text-sm font-mono"
                      >
                        {stap.nummer}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {stap.title}
                      </h3>
                      {!isLast && (
                        <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
                      )}
                    </div>
                    <p className="hidden sm:block text-slate-400 text-sm leading-relaxed mb-4">
                      {stap.description}
                    </p>
                    <div className="hidden sm:flex flex-wrap gap-2">
                      {stap.details.map((detail) => (
                        <span
                          key={detail}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${c.badge}`}
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
