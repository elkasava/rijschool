"use client";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence, useAnimate, useReducedMotion } from "framer-motion";
import { scaleTap, successPop } from "@/lib/motion-presets";
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
import { track } from "@vercel/analytics";
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

type FormFields = { naam: string; email: string; telefoon: string; bericht: string; datum: string; tijd: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function sanitize(value: string): string {
  return value.replace(/[<>"'`]/g, "").trim();
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(form: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!form.naam.trim()) errors.naam = "Vul je naam in.";
  else if (form.naam.trim().length < 2) errors.naam = "Naam moet minimaal 2 tekens zijn.";

  if (!form.email.trim()) errors.email = "Vul je e-mailadres in.";
  else if (!validateEmail(form.email)) errors.email = "Voer een geldig e-mailadres in.";

  if (form.telefoon && !/^[0-9()+\-\s]{6,20}$/.test(form.telefoon))
    errors.telefoon = "Voer een geldig telefoonnummer in.";

  if (!form.bericht.trim()) errors.bericht = "Schrijf een kort bericht.";
  else if (form.bericht.trim().length < 10) errors.bericht = "Bericht moet minimaal 10 tekens zijn.";

  return errors;
}

export default function Contact() {
  const [form, setForm] = useState<FormFields>({ naam: "", email: "", telefoon: "", bericht: "", datum: "", tijd: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [interesse, setInteresse] = useState("Proefles");

  const prefersReduced = useReducedMotion();
  const [formScope, animateShake] = useAnimate();

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();

    const ctx = gsap.context(() => {
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Re-validate field on change if already touched
    if (touched[name as keyof FormFields]) {
      const newErrors = validateForm({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormFields] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateForm(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormFields] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof FormFields, boolean>
    );
    setTouched(allTouched);
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      if (!prefersReduced && formScope.current) {
        animateShake(formScope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.35 });
      }
      return;
    }

    setStatus("sending");

    // Sanitize before sending
    const safe = {
      naam: sanitize(form.naam),
      email: sanitize(form.email),
      telefoon: sanitize(form.telefoon),
      bericht: sanitize(form.bericht),
      datum: sanitize(form.datum),
      tijd: sanitize(form.tijd),
    };

    const msg =
      `Hallo Rij2Go! 👋\n\n` +
      `Naam: ${safe.naam}\n` +
      `E-mail: ${safe.email}\n` +
      `Telefoon: ${safe.telefoon || "niet opgegeven"}\n` +
      `Interesse: ${interesse}\n` +
      (safe.datum ? `Gewenste datum: ${safe.datum}${safe.tijd ? ` om ${safe.tijd}` : ""}\n` : "") +
      `\nBericht:\n${safe.bericht}`;

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");

    track("contact_form_submit", { interesse });
    setStatus("sent");
  };

  const fieldError = (name: keyof FormFields) => (
    <AnimatePresence>
      {touched[name] && errors[name] && (
        <m.p
          key={name}
          id={`${name}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="text-rose-500 text-xs mt-1"
        >
          {errors[name]}
        </m.p>
      )}
    </AnimatePresence>
  );

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
                        <Icon className="w-5 h-5 text-brand-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-white font-medium text-sm hover:text-brand-400 transition-colors"
                            onClick={() =>
                              track("contact_info_click", { type: item.label.toLowerCase() })
                            }
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

              {/* Trust statements */}
              <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col gap-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-white font-semibold">Proefles —</span>{" "}
                  Geen verplichtingen. Maak gewoon vrijblijvend kennis met je instructeur en ontdek of het klikt.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-white font-semibold">Snel antwoord —</span>{" "}
                  Stuur je bericht en we nemen binnen 24 uur contact op. Vaak al binnen een uur.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            ref={formRef}
            style={{ opacity: 0 }}
          >
            <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <m.div
                key="success"
                variants={successPop}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-emerald-50 rounded-3xl border border-emerald-100 p-10"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Bericht verstuurd!
                </h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Bedankt voor je aanvraag, {form.naam}! We nemen zo snel
                  mogelijk contact met je op, uiterlijk binnen 24 uur.
                </p>
              </m.div>
            ) : (
              <m.form
                key="form"
                ref={formScope}
                onSubmit={handleSubmit}
                noValidate
                initial={false}
                aria-label="Contactformulier – stuur een aanvraag"
                className="bg-slate-50 rounded-3xl p-8 lg:p-10 border border-slate-100"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Stuur een bericht
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="naam" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Naam <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="naam"
                      name="naam"
                      value={form.naam}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Jan de Vries"
                      required
                      aria-required="true"
                      aria-invalid={touched.naam && !!errors.naam}
                      aria-describedby={errors.naam ? "naam-error" : undefined}
                      className={`bg-white border-slate-200 focus-visible:ring-brand-500 ${touched.naam && errors.naam ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
                    />
                    {fieldError("naam")}
                  </div>

                  {/* Email */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                      E-mailadres <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="jan@voorbeeld.nl"
                      required
                      aria-required="true"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`bg-white border-slate-200 focus-visible:ring-brand-500 ${touched.email && errors.email ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
                    />
                    {fieldError("email")}
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
                      onBlur={handleBlur}
                      placeholder="06-1234 5678"
                      aria-invalid={touched.telefoon && !!errors.telefoon}
                      aria-describedby={errors.telefoon ? "telefoon-error" : undefined}
                      className={`bg-white border-slate-200 focus-visible:ring-brand-500 ${touched.telefoon && errors.telefoon ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
                    />
                    {fieldError("telefoon")}
                  </div>

                  {/* Date + Time */}
                  <div data-field style={{ opacity: 0 }} className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="datum" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Gewenste datum
                      </label>
                      <Input
                        id="datum"
                        name="datum"
                        type="date"
                        value={form.datum}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-white border-slate-200 focus-visible:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="tijd" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Gewenste tijd
                      </label>
                      <select
                        id="tijd"
                        name="tijd"
                        value={form.tijd}
                        onChange={(e) => setForm({ ...form, tijd: e.target.value })}
                        aria-label="Gewenste lestijd"
                        className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                      >
                        <option value="">Kies tijd</option>
                        {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="bericht" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Bericht <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="bericht"
                      name="bericht"
                      value={form.bericht}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Vertel ons meer over jezelf en je rijervaring..."
                      required
                      aria-required="true"
                      aria-invalid={touched.bericht && !!errors.bericht}
                      aria-describedby={errors.bericht ? "bericht-error" : undefined}
                      rows={4}
                      className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${touched.bericht && errors.bericht ? "border-rose-400 focus-visible:ring-rose-400" : "border-slate-200"}`}
                    />
                    {fieldError("bericht")}
                  </div>

                  {/* Interest */}
                  <div data-field style={{ opacity: 0 }}>
                    <fieldset>
                      <legend className="block text-sm font-medium text-slate-700 mb-2">
                        Ik ben geïnteresseerd in
                      </legend>
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
                    </fieldset>
                  </div>
                </div>

                <m.div
                  className="mt-6"
                  whileHover={prefersReduced || status === "sending" ? undefined : scaleTap.whileHover}
                  whileTap={prefersReduced || status === "sending" ? undefined : scaleTap.whileTap}
                  transition={scaleTap.transition}
                >
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "sending"}
                    aria-label="Verstuur aanvraag via WhatsApp"
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-400/20 gap-2"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Versturen…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" />
                        Verstuur Aanvraag
                      </>
                    )}
                  </Button>
                </m.div>

                <p className="text-slate-400 text-xs text-center mt-3">
                  We reageren altijd binnen 24 uur. Liever direct contact?{" "}
                  <a
                    href={`tel:${telefoonLink}`}
                    className="text-brand-600 hover:underline"
                    onClick={() => track("contact_phone_click")}
                  >
                    Bel ons
                  </a>
                  .
                </p>
              </m.form>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
