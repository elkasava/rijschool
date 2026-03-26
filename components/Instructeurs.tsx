"use client";

import { useRef, useEffect } from "react";
import { Users, Languages, Award } from "lucide-react";
import content from "@/data/content.json";
import { registerGsap, gsap } from "@/lib/gsap";

const instructeurs = content.instructeurs;

export default function Instructeurs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      const cards = cardsRef.current?.querySelectorAll("[data-card]");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: "expoOut", stagger: 0.15,
            scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="instructeurs" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0 }} className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Ons team
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Maak kennis met je instructeur
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Ervaren, geduldig en gecertificeerd. Jouw instructeur staat altijd voor je klaar.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {instructeurs.map((inst) => (
            <div
              key={inst.naam}
              data-card
              style={{ opacity: 0 }}
              className="bg-slate-50 rounded-3xl border border-slate-100 p-8 hover:shadow-lg transition-all duration-300 hover:border-brand-100"
            >
              {/* Avatar placeholder */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-400/25">
                <Users className="w-9 h-9 text-white" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-0.5">{inst.naam}</h3>
              <p className="text-brand-600 text-sm font-medium mb-4">{inst.titel}</p>

              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {inst.beschrijving}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                  <p className="text-xl font-bold text-slate-900">{inst.stats.leerlingen}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Leerlingen begeleid</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
                  <p className="text-xl font-bold text-brand-600">{inst.stats.slagingspercentage}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Slagingspercentage</p>
                </div>
              </div>

              {/* Specialisaties */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">
                  <Award className="w-3.5 h-3.5" />
                  Specialisaties
                </div>
                <div className="flex flex-wrap gap-2">
                  {inst.specialisaties.map((s) => (
                    <span key={s} className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Talen */}
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">
                  <Languages className="w-3.5 h-3.5" />
                  Talen
                </div>
                <p className="text-slate-600 text-sm">{inst.talen.join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
