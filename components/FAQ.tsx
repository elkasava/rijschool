"use client";

import { useRef, useEffect } from "react";
import { m, useReducedMotion } from "framer-motion";
import { scaleTap } from "@/lib/motion-presets";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";
import { useContent } from "@/lib/LanguageContext";
import { registerGsap, gsap } from "@/lib/gsap";

export default function FAQ() {
  const content = useContent();
  const faqs = content.faq;
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Dramatic header reveal — section label + heading + sub
      const headerChildren = headerRef.current?.children;
      if (headerChildren && headerChildren.length > 0) {
        gsap.fromTo(
          Array.from(headerChildren),
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "expoOut",
            stagger: 0.1,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Accordion items stagger in with 0.06s between items
      const items = accordionRef.current?.querySelectorAll("[data-faq-item]");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "expoOut",
            stagger: 0.06,
            scrollTrigger: {
              trigger: accordionRef.current,
              start: "top 85%",
              once: true,
            },
            delay: 0.1,
          }
        );
      }

      // Bottom CTA card
      gsap.fromTo(
        ctaRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "expoOut",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="py-12 sm:py-20 lg:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
        >
          <span
            style={{ opacity: 0 }}
            className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            {content.ui.sections.faq}
          </span>
          <h2
            style={{ opacity: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            {content.ui.faq.heading}
          </h2>
          <p
            style={{ opacity: 0 }}
            className="text-slate-500 text-lg max-w-xl mx-auto"
          >
            {content.ui.faq.notListed}
          </p>
        </div>

        {/* Accordion */}
        <div
          ref={accordionRef}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <Accordion type="single" collapsible className="divide-y divide-slate-100">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                data-faq-item
                style={{ opacity: 0 }}
                className="border-0 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-brand-600 hover:no-underline py-5 text-sm sm:text-base">
                  {faq.vraag}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 text-sm leading-relaxed pb-5">
                  {faq.antwoord}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still questions CTA */}
        <div
          ref={ctaRef}
          style={{ opacity: 0 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-slate-800 font-semibold text-sm">{content.ui.faq.stillQuestion}</p>
              <p className="text-slate-400 text-xs">{content.ui.faq.replyTime}</p>
            </div>
            <m.a
              href={`https://wa.me/${content.algemeen.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={prefersReduced ? undefined : scaleTap.whileHover}
              whileTap={prefersReduced ? undefined : scaleTap.whileTap}
              transition={scaleTap.transition}
              className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap inline-block"
            >
              {content.ui.faq.appButton}
            </m.a>
          </div>
        </div>
      </div>
    </section>
  );
}
