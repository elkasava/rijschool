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
      gsap.fromTo(
        subLabelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expoOut", scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(
        headingLine1Ref.current,
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "expoOut", scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true }, delay: 0.08 }
      );
      gsap.fromTo(
        headingLine2Ref.current,
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "expoOut", scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true }, delay: 0.16 }
      );
      gsap.fromTo(
        subTextRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expoOut", scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true }, delay: 0.24 }
      );

      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: "expoOut", stagger: 0.08, scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true } }
        );
      }

      const icons = gridRef.current?.querySelectorAll("[data-icon]");
      if (icons && icons.length > 0) {
        gsap.fromTo(
          icons,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)", stagger: 0.08, scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true }, delay: 0.12 }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current || st.vars.trigger === gridRef.current) st.kill();
      });
    };
  }, []);

  const [v0, v1, v2, v3] = voordelen;

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-20 lg:py-28 bg-slate-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <Image src="/polo.webp" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — left + right split */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 sm:mb-14 gap-4 sm:gap-6">
          <div>
            <span
              ref={subLabelRef}
              style={{ opacity: 0 }}
              className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Waarom kiezen voor ons?
            </span>
            <div className="overflow-hidden">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                <span ref={headingLine1Ref} style={{ opacity: 0, display: "block" }}>
                  Alles voor
                </span>
                <span ref={headingLine2Ref} style={{ opacity: 0, display: "block" }}>
                  jouw succes
                </span>
              </h2>
            </div>
          </div>
          <p
            ref={subTextRef}
            style={{ opacity: 0 }}
            className="text-slate-500 text-base lg:text-lg max-w-xs lg:text-right shrink-0"
          >
            Meer dan 2.000 leerlingen gingen je voor.
            <br className="hidden lg:block" />
            Dit is waarom ze voor ons kozen.
          </p>
        </div>

        {/* Bento grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">

          {/* Card 0 — Featured dark, col-span-2 */}
          {v0 && (() => { const Icon = v0.icon; return (
            <div
              data-card
              style={{ opacity: 0 }}
              className="md:col-span-2 bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden group"
            >
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-brand-400/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
              <div
                data-icon
                style={{ opacity: 0 }}
                className={`w-14 h-14 ${v0.bg} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
              >
                <Icon className={`w-7 h-7 ${v0.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{v0.title}</h3>
              <p className="text-slate-400 leading-relaxed relative z-10 max-w-md">{v0.description}</p>
              <span className="absolute bottom-7 right-9 text-8xl font-black text-white/[0.04] select-none leading-none">01</span>
            </div>
          );})()}

          {/* Card 1 — Small white */}
          {v1 && (() => { const Icon = v1.icon; return (
            <div
              data-card
              style={{ opacity: 0 }}
              className="bg-white rounded-3xl p-7 border border-slate-100 flex flex-col justify-between group hover:border-brand-100 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div
                  data-icon
                  style={{ opacity: 0 }}
                  className={`w-12 h-12 ${v1.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 ${v1.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{v1.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v1.description}</p>
              </div>
              <span className="mt-6 text-5xl font-black text-slate-100 select-none leading-none">02</span>
            </div>
          );})()}

          {/* Card 2 — Small white */}
          {v2 && (() => { const Icon = v2.icon; return (
            <div
              data-card
              style={{ opacity: 0 }}
              className="bg-white rounded-3xl p-7 border border-slate-100 flex flex-col justify-between group hover:border-brand-100 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div
                  data-icon
                  style={{ opacity: 0 }}
                  className={`w-12 h-12 ${v2.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 ${v2.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{v2.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v2.description}</p>
              </div>
              <span className="mt-6 text-5xl font-black text-slate-100 select-none leading-none">03</span>
            </div>
          );})()}

          {/* Card 3 — Featured brand, col-span-2 */}
          {v3 && (() => { const Icon = v3.icon; return (
            <div
              data-card
              style={{ opacity: 0 }}
              className="md:col-span-2 bg-brand-600 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden group"
            >
              <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-1/2 w-64 h-32 bg-brand-400/30 rounded-full blur-3xl pointer-events-none" />
              <div
                data-icon
                style={{ opacity: 0 }}
                className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6 relative z-10"
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{v3.title}</h3>
              <p className="text-brand-100 leading-relaxed relative z-10 max-w-md">{v3.description}</p>
              <span className="absolute bottom-7 right-9 text-8xl font-black text-white/[0.07] select-none leading-none">04</span>
            </div>
          );})()}

        </div>
      </div>
    </section>
  );
}
