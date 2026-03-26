"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, Trophy, Zap, Shield, Clock, ThumbsUp, type LucideIcon } from "lucide-react";
import content from "@/data/content.json";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

const iconMap: Record<string, LucideIcon> = { Heart, Trophy, Zap, Shield, Clock, ThumbsUp };
const voordelen = content.voordelen.map((v) => ({ ...v, icon: iconMap[v.icon] ?? Heart }));

export default function Voordelen() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);
  const subLabelRef = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Sub-label
      gsap.fromTo(
        subLabelRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "expoOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );

      // Heading line 1
      gsap.fromTo(
        headingLine1Ref.current,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "expoOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
          delay: 0.08,
        }
      );

      // Heading line 2
      gsap.fromTo(
        headingLine2Ref.current,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "expoOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
          delay: 0.16,
        }
      );

      // Sub paragraph
      gsap.fromTo(
        subTextRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "expoOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
          delay: 0.24,
        }
      );

      // Cards stagger grid reveal
      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "expoOut",
            stagger: 0.08,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Icon scale bounce on card enter
      const icons = gridRef.current?.querySelectorAll("[data-icon]");
      if (icons && icons.length > 0) {
        gsap.fromTo(
          icons,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              once: true,
            },
            delay: 0.12,
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current || st.vars.trigger === gridRef.current) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 bg-slate-50 overflow-hidden">
      {/* polo.webp background at 20% opacity */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <Image src="/polo.webp" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 overflow-hidden">
          <span
            ref={subLabelRef}
            style={{ opacity: 0 }}
            className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Waarom kiezen voor ons?
          </span>
          {/* Heading split into two lines for line-by-line reveal */}
          <div className="overflow-hidden">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              <span
                ref={headingLine1Ref}
                style={{ opacity: 0, display: "block" }}
              >
                Alles voor
              </span>
              <span
                ref={headingLine2Ref}
                style={{ opacity: 0, display: "block" }}
              >
                jouw succes
              </span>
            </h2>
          </div>
          <p
            ref={subTextRef}
            style={{ opacity: 0 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Bij Rijschool Rij2Go staat jouw veiligheid en rijplezier centraal.
            Ontdek waarom meer dan 2.000 leerlingen ons kozen.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {voordelen.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                data-card
                style={{ opacity: 0 }}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md border border-slate-100 hover:border-brand-100 transition-all duration-300 group"
              >
                <div
                  data-icon
                  style={{ opacity: 0 }}
                  className={`w-12 h-12 ${v.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {v.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
