"use client";

import { useRef, useEffect } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import content from "@/data/content.json";
import { registerGsap, gsap } from "@/lib/gsap";

const { telefoonLink, whatsapp } = content.algemeen;

export default function CtaBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Staggered text reveal from bottom
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "expoOut" },
      });

      tl.fromTo(labelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo(line1Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.35")
        .fromTo(line2Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
        .fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.3");

      // Primary button pulse attention after 2s delay
      gsap.to(primaryBtnRef.current, {
        scale: 1.04,
        boxShadow: "0 0 0 8px rgba(99,102,241,0.15)",
        duration: 0.55,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 3,
        delay: 2.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #4f46e5 100%)",
        backgroundSize: "200% 200%",
        animation: "ctaGradientShift 8s ease infinite",
      }}
    >

      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span
          ref={labelRef}
          style={{ opacity: 0 }}
          className="inline-block text-blue-100 font-semibold text-sm uppercase tracking-widest mb-4"
        >
          Klaar om te beginnen?
        </span>

        {/* Heading split into two lines */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
          <span
            ref={line1Ref}
            style={{ opacity: 0, display: "block" }}
          >
            Jouw rijbewijs begint met
          </span>
          <span
            ref={line2Ref}
            style={{ opacity: 0, display: "block" }}
          >
            één proefles
          </span>
        </h2>

        <p
          ref={subRef}
          style={{ opacity: 0 }}
          className="text-blue-100 text-lg max-w-xl mx-auto mb-10"
        >
          Vrijblijvend kennismaken met onze instructeur. Geen verplichtingen,
          wel een persoonlijk rijplan dat bij jou past.
        </p>

        <div
          ref={buttonsRef}
          style={{ opacity: 0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            ref={primaryBtnRef}
            size="xl"
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-xl shadow-indigo-900/20 group"
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Proefles aanvragen
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <a
            href={`https://wa.me/${whatsapp}?text=Hallo%20Rij2Go!%20Ik%20wil%20graag%20meer%20informatie%20over%20jullie%20rijlessen.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp ons
          </a>
          <a
            href={`tel:${telefoonLink}`}
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            Of bel direct
          </a>
        </div>
      </div>
    </section>
  );
}
