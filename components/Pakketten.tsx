"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Check, Sparkles, Tag, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import contentData from "@/data/content.json";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { cardLift, scaleTap } from "@/lib/motion-presets";

interface Pakket {
  name: string;
  tag: string;
  price: string;
  priceOld?: string;
  priceNote: string;
  lessen: string;
  duration: string;
  korting?: string;
  description: string;
  features: string[];
  highlight: boolean;
  accent?: string;
  cta: string;
}

const pakketten = contentData.pakketten as Pakket[];
const losseTarieven = contentData.losseTarieven;

/** Extract numeric value from a price string like "€599" or "€49,95" */
function extractPrice(priceStr: string): number {
  const num = parseFloat(priceStr.replace(/[^0-9,.]/g, "").replace(",", "."));
  return isNaN(num) ? 0 : num;
}

/** Format number back to price-like string preserving original format */
function formatPrice(val: number, originalStr: string): string {
  // Detect if original has decimal comma
  const hasDecimal = originalStr.includes(",");
  if (hasDecimal) {
    return `€${val.toFixed(2).replace(".", ",")}`;
  }
  return `€${Math.round(val)}`;
}

function PrijsCounter({ price }: { price: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const targetVal = extractPrice(price);

  useEffect(() => {
    if (typeof window === "undefined" || targetVal === 0) return;
    registerGsap();

    const el = ref.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: targetVal,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            if (el) el.textContent = formatPrice(counter.val, price);
          },
          onComplete: () => {
            // Set exact original price string at end
            if (el) el.textContent = price;
          },
        });
      },
    });

    return () => st.kill();
  }, [price, targetVal]);

  return (
    <span ref={ref} className="tabular-nums">
      {price}
    </span>
  );
}

export default function Pakketten() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const tariefRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: el, threshold: 0.5 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // GSAP scroll-triggered animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "expoOut",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Cards slide in from right
      const cards = scrollRef.current?.querySelectorAll("[data-card]");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "expoOut",
            stagger: 0.1,
            scrollTrigger: {
              trigger: carouselRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Losse tarieven row
      gsap.fromTo(
        tariefRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "expoOut",
          scrollTrigger: {
            trigger: tariefRef.current,
            start: "top 88%",
            once: true,
          },
          delay: 0.1,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [tarievenOpen, setTarievenOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const slide = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir === "next" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  const scrollToContact = (pakketName?: string) => {
    if (pakketName) track("pakket_cta_click", { pakket: pakketName });
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="pakketten" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          style={{ opacity: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Rijpakketten
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Kies jouw pakket
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Transparante prijzen zonder verborgen kosten. Hoe meer lessen, hoe groter de korting.
            Twijfel je? Vraag eerst een proefles aan.
          </p>
        </div>

        {/* Carousel wrapper */}
        <div ref={carouselRef} className="relative">
          {/* Prev button */}
          <button
            onClick={() => slide("prev")}
            disabled={atStart}
            aria-label="Vorige pakket"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 w-11 h-11 rounded-full shadow-lg border flex items-center justify-center transition-all duration-200 ${
              atStart
                ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600 hover:shadow-xl"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {pakketten.map((pakket) => {
              const isStartSnel = pakket.accent === "pink";

              return (
                <div
                  key={pakket.name}
                  data-card
                  style={{ opacity: 0 }}
                  className="relative flex-none w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex pt-5"
                >
                  {/* Badge */}
                  {pakket.tag && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap ${
                          isStartSnel ? "bg-pink-500" : "bg-brand-600"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {pakket.tag}
                      </span>
                    </div>
                  )}

                  <m.div
                    whileHover={prefersReduced ? undefined : cardLift.whileHover}
                    transition={cardLift.transition}
                    className={`relative flex flex-col w-full rounded-2xl border overflow-hidden
                      ${
                        isStartSnel
                          ? "border-slate-700 shadow-xl shadow-slate-900/20"
                          : pakket.highlight
                          ? "border-brand-600 shadow-xl shadow-brand-600/20 ring-2 ring-brand-600"
                          : "border-slate-200 hover:border-brand-200 hover:shadow-lg"
                      }`}
                  >
                    {/* Header area */}
                    <div
                      className={`px-6 pb-5 ${pakket.tag ? "pt-8" : "pt-6"} ${
                        isStartSnel ? "bg-slate-900 text-white" : "bg-white"
                      }`}
                    >
                      {/* Name */}
                      <h3
                        className={`text-lg font-bold mb-1 ${
                          isStartSnel
                            ? "text-white"
                            : pakket.highlight
                            ? "text-brand-600"
                            : "text-slate-900"
                        }`}
                      >
                        {pakket.name}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed mb-4 ${
                          isStartSnel ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {pakket.description}
                      </p>

                      {/* Price with counter animation */}
                      <div className="flex items-end gap-2">
                        {pakket.priceOld && (
                          <span className="text-sm line-through text-slate-400 mb-0.5">
                            {pakket.priceOld}
                          </span>
                        )}
                        <span
                          className={`text-3xl font-extrabold leading-none ${
                            isStartSnel ? "text-pink-400" : "text-slate-900"
                          }`}
                        >
                          <PrijsCounter price={pakket.price} />
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${isStartSnel ? "text-slate-400" : "text-slate-400"}`}>
                        {pakket.priceNote}
                      </p>

                      {/* Lessen + korting */}
                      <div className="mt-3 flex flex-col gap-1">
                        <span
                          className={`text-sm font-semibold ${
                            isStartSnel
                              ? "text-slate-200"
                              : pakket.highlight
                              ? "text-brand-600"
                              : "text-slate-700"
                          }`}
                        >
                          {pakket.lessen}{" "}
                          <span
                            className={`font-normal text-xs ${
                              isStartSnel ? "text-slate-400" : "text-slate-400"
                            }`}
                          >
                            {pakket.duration}
                          </span>
                        </span>
                        {pakket.korting && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 w-fit ${
                              isStartSnel
                                ? "bg-pink-500/20 text-pink-300"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            <Tag className="w-3 h-3" />
                            {pakket.korting}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex-1 px-6 py-5 bg-white">
                      <div
                        className={`h-px mb-5 ${
                          pakket.highlight ? "bg-brand-100" : "bg-slate-100"
                        }`}
                      />
                      <ul className="space-y-2.5">
                        {pakket.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isStartSnel
                                  ? "bg-pink-50"
                                  : pakket.highlight
                                  ? "bg-brand-100"
                                  : "bg-emerald-50"
                              }`}
                            >
                              <Check
                                className={`w-2.5 h-2.5 ${
                                  isStartSnel
                                    ? "text-pink-500"
                                    : pakket.highlight
                                    ? "text-brand-600"
                                    : "text-emerald-600"
                                }`}
                              />
                            </div>
                            <span className="text-slate-600 text-xs leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="px-6 pb-6 bg-white">
                      <m.div
                        whileHover={prefersReduced ? undefined : scaleTap.whileHover}
                        whileTap={prefersReduced ? undefined : scaleTap.whileTap}
                        transition={scaleTap.transition}
                      >
                        <Button
                          className={`w-full font-semibold text-sm ${
                            isStartSnel
                              ? "bg-pink-500 hover:bg-pink-400 text-white shadow-lg shadow-pink-500/25 border-0"
                              : pakket.highlight
                              ? "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25"
                              : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-brand-300 hover:text-brand-700"
                          }`}
                          variant={isStartSnel || pakket.highlight ? "default" : "outline"}
                          size="lg"
                          onClick={() => scrollToContact(pakket.name)}
                        >
                          {pakket.cta}
                        </Button>
                      </m.div>
                    </div>
                  </m.div>
                </div>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => slide("next")}
            disabled={atEnd}
            aria-label="Volgende pakket"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 w-11 h-11 rounded-full shadow-lg border flex items-center justify-center transition-all duration-200 ${
              atEnd
                ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600 hover:shadow-xl"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {pakketten.map((p, i) => (
            <button
              key={p.name}
              aria-label={`Ga naar ${p.name}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const card = el.querySelectorAll<HTMLElement>("[data-card]")[i];
                if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? "bg-brand-600" : "bg-slate-300 hover:bg-brand-400"
              }`}
            />
          ))}
        </div>

        {/* Losse tarieven */}
        <div
          ref={tariefRef}
          style={{ opacity: 0 }}
          className="mt-16"
        >
          <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
            {/* Mobile: collapsible header */}
            <button
              className="sm:hidden w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setTarievenOpen((o) => !o)}
              aria-expanded={tarievenOpen}
            >
              <div>
                <h3 className="text-slate-900 font-bold text-lg">Losse tarieven</h3>
                <p className="text-slate-500 text-sm mt-0.5">
                  Individuele lessen, examens en toetsen — zonder pakket.
                </p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${tarievenOpen ? "rotate-180" : ""}`}
              />
            </button>
            {/* Desktop: always-visible header */}
            <div className="hidden sm:block px-6 py-5 border-b border-slate-100">
              <h3 className="text-slate-900 font-bold text-lg">Losse tarieven</h3>
              <p className="text-slate-500 text-sm mt-0.5">
                Individuele lessen, examens en toetsen — zonder pakket.
              </p>
            </div>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 divide-x divide-y sm:divide-y-0 divide-slate-100 ${tarievenOpen ? "" : "hidden sm:grid"}`}>
              {losseTarieven.map((t, i) => (
                <div
                  key={t.label}
                  className={`flex flex-col items-center justify-center px-4 py-5 text-center gap-1 ${
                    i === 0 ? "bg-brand-50" : ""
                  }`}
                >
                  <span className="text-xl font-extrabold text-slate-900">
                    {t.prijs}
                  </span>
                  <span className="text-slate-500 text-xs leading-snug">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Alle pakketten zijn inclusief CBR-praktijkexamen. Maatwerk mogelijk — neem contact op voor persoonlijk advies.
        </p>
      </div>
    </section>
  );
}
