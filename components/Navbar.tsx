"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useLanguage, useContent } from "@/lib/LanguageContext";
import { registerGsap, gsap } from "@/lib/gsap";

export default function Navbar() {
  const { lang, setLang, content } = useLanguage();
  const navContent = useContent();
  const { schoolNaam, telefoon, telefoonLink, whatsapp } = content.algemeen;

  const navLinks = [
    { label: navContent.ui.nav.packages, href: "#pakketten", isPage: false },
    { label: navContent.ui.nav.reviews, href: "#reviews", isPage: false },
    { label: navContent.ui.nav.contact, href: "#contact", isPage: false },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navItemsRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // GSAP mount entrance
  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expoOut", duration: 0.6 } });

      // Logo slides from left
      tl.fromTo(
        logoRef.current,
        { x: -28, opacity: 0 },
        { x: 0, opacity: 1 }
      );

      // Nav items stagger in (links, buttons, divider, lang toggle wrapper)
      const items = navItemsRef.current?.querySelectorAll("a, button, span[style], div[style]");
      if (items && items.length > 0) {
        tl.fromTo(
          items,
          { y: -12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07 },
          "-=0.4"
        );
      }

      // Right side slides in from right
      tl.fromTo(
        rightRef.current,
        { x: 24, opacity: 0 },
        { x: 0, opacity: 1 },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);

  // GSAP scroll compact mode — smooth background + height transition
  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const header = headerRef.current;
    if (!header) return;

    let isCompact = false;

    const handleScroll = () => {
      const past = window.scrollY > 80;
      if (past === isCompact) return;
      isCompact = past;

      if (past) {
        gsap.to(header, {
          backdropFilter: "blur(12px)",
          duration: 0.35,
          ease: "smoothOut",
        });
        header.classList.add("navbar-scrolled");
      } else {
        gsap.to(header, {
          backdropFilter: "blur(0px)",
          duration: 0.35,
          ease: "smoothOut",
        });
        header.classList.remove("navbar-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = (href: string) => {
    setMobileOpen(false);
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 navbar-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* 3-column grid: logo | nav+lang (centered) | contact */}
        <div className="grid grid-cols-3 items-center h-24">
          {/* Left: Logo */}
          <a
            ref={logoRef}
            href="/"
            className="flex items-center"
            style={{ opacity: 0 }}
          >
            <Image
              src="/logo.png"
              alt={schoolNaam}
              width={240}
              height={60}
              priority
              className="h-[60px] object-contain"
              style={{ width: "auto" }}
            />
          </a>

          {/* Center: Desktop nav + language toggle */}
          <nav
            ref={navItemsRef}
            className="hidden md:flex items-center justify-center gap-1"
          >
            {navLinks.map((link) =>
              link.isPage ? (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ opacity: 0 }}
                  className="px-5 py-2 text-slate-300 hover:text-white text-base font-medium rounded-md hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleAnchorClick(link.href)}
                  style={{ opacity: 0 }}
                  className="px-5 py-2 text-slate-300 hover:text-white text-base font-medium rounded-md hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
                >
                  {link.label}
                </button>
              )
            )}

            {/* Divider */}
            <span style={{ opacity: 0 }} className="w-px h-5 bg-white/20 mx-2" />

            {/* Language toggle - desktop (centered with nav) */}
            <div style={{ opacity: 0 }} className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => setLang("nl")}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${lang === "nl" ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"}`}
                title="Wissel naar Nederlands"
              >
                NL
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${lang === "en" ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"}`}
                title="Switch to English"
              >
                EN
              </button>
            </div>
          </nav>

          {/* Right: Phone + WhatsApp + Mobile toggle */}
          <div
            ref={rightRef}
            className="flex items-center justify-end gap-3"
            style={{ opacity: 0 }}
          >
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:${telefoonLink}`}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{telefoon}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact via WhatsApp"
                onClick={() => track("whatsapp_navbar_click")}
                className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 hover:bg-emerald-500/40 rounded-full transition-colors flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-400">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? navContent.ui.nav.closeMenu : navContent.ui.nav.openMenu}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-900 border-t border-slate-800"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.isPage ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => handleAnchorClick(link.href)}
                    className="text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </button>
                )
              )}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 px-4">
                <a
                  href={`tel:${telefoonLink}`}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{telefoon}</span>
                </a>
                {/* Language toggle - mobile */}
                <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
                  <button
                    onClick={() => { setLang("nl"); setMobileOpen(false); }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${lang === "nl" ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"}`}
                    title="Wissel naar Nederlands"
                  >
                    NL
                  </button>
                  <button
                    onClick={() => { setLang("en"); setMobileOpen(false); }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${lang === "en" ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"}`}
                    title="Switch to English"
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
