"use client";

import { useEffect, useRef } from "react";
import { m } from "framer-motion";
import { ArrowRight, Star, CheckCircle2, TrendingUp, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import content from "@/data/content.json";
import { registerGsap, gsap } from "@/lib/gsap";

const { stats, beoordeling, subtext, checkmarks } = content.hero;
const { werkgebied } = content.algemeen;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const checklistRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Defer video load until after LCP — avoids blocking critical resources
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const timer = setTimeout(() => {
      video.src = "/hero-video.mp4";
      video.load();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // GSAP entrance timeline
  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expoOut" } });

      // Badge slides up
      tl.fromTo(
        badgeRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      // Headline: split words and stagger reveal
      const headline = headlineRef.current;
      if (headline) {
        // Wrap each word in a span (preserving gradient span)
        const rawHTML = headline.innerHTML;
        // We split on text nodes only — replace text content word-by-word
        const words = headline.innerText.split(/\s+/);
        // Rebuild with word spans — preserving the gradient span structure
        // Instead: animate the whole h1 lines by treating it as two visual chunks
        gsap.fromTo(
          headline,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.05,
            ease: "expoOut",
          }
        );
        // Prevent TypeScript warning about unused vars
        void rawHTML;
        void words;
      }

      // Subtext
      tl.fromTo(
        subRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.45"
      );

      // Checklist items staggered
      const items = checklistRef.current?.querySelectorAll("li");
      if (items && items.length > 0) {
        tl.fromTo(
          items,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.35"
        );
      }

      // CTA buttons
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      // Social proof card from right
      tl.fromTo(
        cardRef.current,
        { x: 40, opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "expoOut" },
        "-=0.7"
      );

      // Stats bar
      tl.fromTo(
        statsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Video background — deferred for LCP performance */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/polo.webp"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: "transform" }}
      />

      {/* Dark overlay over video */}
      <div className="absolute inset-0 bg-slate-900/45" />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-transparent to-brand-950/60" />

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <div
              ref={badgeRef}
              style={{ opacity: 0 }}
              className="inline-flex items-center gap-2 bg-brand-400/20 border border-brand-400/30 rounded-full px-4 py-1.5 mb-6"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 text-sm font-medium">
                Beoordeeld met {beoordeling}
              </span>
            </div>

            {/* Heading — GSAP animated */}
            <h1
              ref={headlineRef}
              style={{ opacity: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Haal je rijbewijs{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
                met zelfvertrouwen
              </span>
            </h1>

            {/* Sub-heading */}
            <p
              ref={subRef}
              style={{ opacity: 0 }}
              className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg"
            >
              {subtext}
            </p>

            {/* Checkmarks */}
            <ul
              ref={checklistRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-10"
            >
              {checkmarks.map((item) => (
                <li
                  key={item}
                  style={{ opacity: 0 }}
                  className="flex items-center gap-2 text-slate-300 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div
              ref={ctaRef}
              style={{ opacity: 0 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="xl"
                onClick={() => scrollTo("#contact")}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-400/25 hover:shadow-brand-400/40 transition-all duration-300 group"
              >
                Proefles Aanvragen
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => scrollTo("#pakketten")}
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-white/10 hover:border-slate-500"
              >
                Bekijk Pakketten
              </Button>
            </div>
          </div>

          {/* Right: Social proof card */}
          <div
            ref={cardRef}
            style={{ opacity: 0 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[416px]">
              {/* Glow */}
              <div className="absolute inset-0 bg-brand-400/20 rounded-3xl blur-3xl scale-125" />

              {/* Card */}
              <div
                className="relative border border-slate-700/80 rounded-3xl overflow-hidden p-6 flex flex-col gap-4"
                style={{ backgroundImage: "url('/polo.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
              >
                {/* Rating */}
                <div className="bg-slate-900 rounded-2xl p-4 text-center">
                  <div className="flex justify-center gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-4xl font-bold text-white">{beoordeling.split(" ")[0]}</div>
                  <div className="text-slate-400 text-xs mt-0.5">Gemiddelde beoordeling</div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 rounded-2xl p-4 text-center">
                    <TrendingUp className="w-5 h-5 text-brand-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">96%</div>
                    <div className="text-slate-400 text-xs mt-0.5">Slagingspercentage</div>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-4 text-center">
                    <Users className="w-5 h-5 text-brand-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">2.000+</div>
                    <div className="text-slate-400 text-xs mt-0.5">Tevreden leerlingen</div>
                  </div>
                </div>

                {/* Areas */}
                <div className="bg-slate-900 rounded-2xl px-4 py-3 flex flex-wrap gap-2">
                  {werkgebied.split(", ").map((city) => (
                    <span key={city} className="flex items-center gap-1 px-2.5 py-1 bg-brand-600 rounded-full text-white text-xs font-medium">
                      <MapPin className="w-3 h-3" />{city.replace(" & ", "")}
                    </span>
                  ))}
                </div>

                {/* Recent success */}
                <div className="bg-slate-900 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-400 text-xs font-semibold">Zojuist geslaagd!</p>
                    <p className="text-slate-400 text-xs">Leerling in Amsterdam</p>
                  </div>
                  <div className="ml-auto text-slate-500 text-xs whitespace-nowrap">2u geleden</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          style={{ opacity: 0 }}
          className="mt-16 grid grid-cols-3 gap-4 border-t border-slate-800 pt-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <m.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-brand-400 rounded-full" />
        </div>
      </m.div>
    </section>
  );
}
