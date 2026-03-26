"use client";

import { useRef, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import content from "@/data/content.json";
import { registerGsap, gsap } from "@/lib/gsap";

const testimonials = content.testimonials;

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "expoOut",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
        }
      );

      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: "expoOut", stagger: 0.09,
            scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="reviews" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0 }} className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Ervaringen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Wat onze leerlingen zeggen
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Meer dan 2.000 tevreden leerlingen gingen je voor. Lees hun verhalen.
          </p>
          {/* Overall rating summary */}
          <div className="inline-flex items-center gap-3 mt-6 bg-white border border-slate-100 rounded-2xl px-6 py-3 shadow-sm">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-slate-900">9.2</span>
            <span className="text-slate-400 text-sm">op basis van 200+ beoordelingen</span>
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <div
              key={t.naam}
              data-card
              style={{ opacity: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-100 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Quote icon */}
              <Quote className="w-7 h-7 text-brand-200 flex-shrink-0" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.beoordeling }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                &ldquo;{t.tekst}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{t.naam}</p>
                  <p className="text-slate-400 text-xs">{t.locatie}</p>
                </div>
                <span className="text-xs font-medium bg-brand-50 text-brand-600 border border-brand-100 rounded-full px-3 py-1">
                  {t.pakket}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
