"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import siteContent from "@/data/content.json";
import { registerGsap, gsap } from "@/lib/gsap";

const { telefoon, telefoonLink, email, werkgebied, openingstijden, schoolNaam, whatsapp } = siteContent.algemeen;

const interesseOpties = [
  "Proefles",
  "Start Snel",
  ...siteContent.pakketten
    .map((p: { name: string }) => p.name)
    .filter((name: string) => name !== "Proefles" && name !== "Start Snel"),
];

const contactInfo = [
  { icon: Phone, label: "Telefoon", value: telefoon, href: `tel:${telefoonLink}` },
  { icon: Mail, label: "E-mail", value: email, href: `mailto:${email}` },
  { icon: MapPin, label: "Werkgebied", value: werkgebied, href: null as string | null },
  { icon: Clock, label: "Openingstijden", value: openingstijden, href: null as string | null },
];

export default function Contact() {
  const [form, setForm] = useState({ naam: "", email: "", telefoon: "", bericht: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [interesse, setInteresse] = useState("Proefles");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Section header
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

      // Contact info panel from left
      gsap.fromTo(
        infoRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: "expoOut",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 85%",
            once: true,
          },
          delay: 0.1,
        }
      );

      // Contact info items stagger from left
      const infoItems = infoRef.current?.querySelectorAll("[data-info-item]");
      if (infoItems && infoItems.length > 0) {
        gsap.fromTo(
          infoItems,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.55,
            ease: "expoOut",
            stagger: 0.08,
            scrollTrigger: {
              trigger: infoRef.current,
              start: "top 82%",
              once: true,
            },
            delay: 0.25,
          }
        );
      }

      // Form panel from right
      gsap.fromTo(
        formRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: "expoOut",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
            once: true,
          },
          delay: 0.15,
        }
      );

      // Form fields stagger in from left
      const formFields = formRef.current?.querySelectorAll("[data-field]");
      if (formFields && formFields.length > 0) {
        gsap.fromTo(
          formFields,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "expoOut",
            stagger: 0.07,
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 82%",
              once: true,
            },
            delay: 0.3,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const msg =
      `Hallo Rij2Go! 👋\n\n` +
      `Naam: ${form.naam}\n` +
      `E-mail: ${form.email}\n` +
      `Telefoon: ${form.telefoon || "niet opgegeven"}\n` +
      `Interesse: ${interesse}\n\n` +
      `Bericht:\n${form.bericht}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsapp}?text=${encoded}`, "_blank");
    setStatus("sent");
  };

  return (
    <section ref={sectionRef} id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          style={{ opacity: 0 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Begin vandaag nog
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Vraag je proefles aan of stel gerust een vraag. We nemen
            binnen 24 uur contact met je op.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact info */}
          <div
            ref={infoRef}
            style={{ opacity: 0 }}
          >
            <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 h-full">
              <h3 className="text-2xl font-bold text-white mb-2">
                {schoolNaam}
              </h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                Wij geloven dat iedereen met de juiste begeleiding kan leren rijden.
                Neem vandaag nog contact op en rij morgen al je eerste les!
              </p>

              <div className="space-y-5">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      data-info-item
                      style={{ opacity: 0 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 bg-brand-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-white font-medium text-sm hover:text-brand-400 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white font-medium text-sm">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust badges */}
              <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 gap-4">
                {[
                  { label: "CBR Erkend", sub: "Officieel gecertificeerd" },
                  { label: "96% Geslaagd", sub: "Boven het landelijk gem." },
                  { label: "Proefles", sub: "Vrijblijvend kennismaken" },
                  { label: "Snel reageren", sub: "Binnen 24 uur contact" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-xs font-semibold">{badge.label}</p>
                      <p className="text-slate-500 text-xs">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            ref={formRef}
            style={{ opacity: 0 }}
          >
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-emerald-50 rounded-3xl border border-emerald-100 p-10">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Bericht verstuurd!
                </h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Bedankt voor je aanvraag, {form.naam}! We nemen zo snel
                  mogelijk contact met je op, uiterlijk binnen 24 uur.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-slate-50 rounded-3xl p-8 lg:p-10 border border-slate-100"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Stuur een bericht
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="naam" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Naam <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="naam"
                      name="naam"
                      value={form.naam}
                      onChange={handleChange}
                      placeholder="Jan de Vries"
                      required
                      className="bg-white border-slate-200 focus-visible:ring-brand-500"
                    />
                  </div>

                  {/* Email */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                      E-mailadres <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jan@voorbeeld.nl"
                      required
                      className="bg-white border-slate-200 focus-visible:ring-brand-500"
                    />
                  </div>

                  {/* Phone */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="telefoon" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Telefoonnummer
                    </label>
                    <Input
                      id="telefoon"
                      name="telefoon"
                      type="tel"
                      value={form.telefoon}
                      onChange={handleChange}
                      placeholder="06-1234 5678"
                      className="bg-white border-slate-200 focus-visible:ring-brand-500"
                    />
                  </div>

                  {/* Message */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="bericht" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Bericht <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="bericht"
                      name="bericht"
                      value={form.bericht}
                      onChange={handleChange}
                      placeholder="Vertel ons meer over jezelf en je rijervaring..."
                      required
                      rows={4}
                      className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  {/* Interest */}
                  <div data-field style={{ opacity: 0 }}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ik ben geïnteresseerd in
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interesseOpties.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:border-brand-300 transition-colors has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
                        >
                          <input
                            type="radio"
                            name="interesse"
                            value={opt}
                            checked={interesse === opt}
                            onChange={() => setInteresse(opt)}
                            className="accent-brand-600"
                          />
                          <span className="text-slate-700 text-xs font-medium">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "sending"}
                  className="w-full mt-6 bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-400/20 gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Versturen…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Verstuur Aanvraag
                    </>
                  )}
                </Button>

                <p className="text-slate-400 text-xs text-center mt-3">
                  We reageren altijd binnen 24 uur. Liever direct contact?{" "}
                  <a
                    href={`tel:${telefoonLink}`}
                    className="text-brand-600 hover:underline"
                  >
                    Bel ons
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
