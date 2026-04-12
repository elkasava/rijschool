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
import { useLanguage } from "@/lib/LanguageContext";
import { registerGsap, gsap } from "@/lib/gsap";

type FormFields = { naam: string; email: string; telefoon: string; bericht: string; datum: string; tijd: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function sanitize(value: string): string {
  return value.replace(/[<>"'`]/g, "").trim();
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Validation is called with the i18n strings passed in so errors are always in the current language
function validateForm(form: FormFields, ui: {
  errorNaam: string; errorNaamMin: string;
  errorEmail: string; errorEmailInvalid: string;
  errorTelefoon: string; errorBericht: string; errorBerichtMin: string;
}): FormErrors {
  const errors: FormErrors = {};
  if (!form.naam.trim()) errors.naam = ui.errorNaam;
  else if (form.naam.trim().length < 2) errors.naam = ui.errorNaamMin;

  if (!form.email.trim()) errors.email = ui.errorEmail;
  else if (!validateEmail(form.email)) errors.email = ui.errorEmailInvalid;

  if (form.telefoon && !/^[0-9()+\-\s]{6,20}$/.test(form.telefoon))
    errors.telefoon = ui.errorTelefoon;

  if (!form.bericht.trim()) errors.bericht = ui.errorBericht;
  else if (form.bericht.trim().length < 10) errors.bericht = ui.errorBerichtMin;

  return errors;
}

export default function Contact() {
  const { lang, content: siteContent } = useLanguage();
  const { telefoon, telefoonLink, email, werkgebied, openingstijden, schoolNaam, whatsapp } = siteContent.algemeen;

  const ui = siteContent.ui.contact;

  const interesseOpties = siteContent.pakketten.map((p: { name: string }) => p.name);

  const contactInfo = [
    { icon: Phone, label: ui.labelTelefoon2, value: telefoon, href: `tel:${telefoonLink}` },
    { icon: Mail, label: ui.labelEmail2, value: email, href: `mailto:${email}` },
    { icon: MapPin, label: ui.labelWerkgebied, value: werkgebied, href: null as string | null },
    { icon: Clock, label: ui.labelOpeningstijden, value: openingstijden, href: null as string | null },
  ];

  const [form, setForm] = useState<FormFields>({ naam: "", email: "", telefoon: "", bericht: "", datum: "", tijd: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [interesse, setInteresse] = useState(() => siteContent.pakketten[0]?.name ?? "");

  // Reset selected package interest to first option when language switches
  useEffect(() => {
    setInteresse(siteContent.pakketten[0]?.name ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

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
      const newErrors = validateForm({ ...form, [name]: value }, ui);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormFields] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateForm(form, ui);
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
    const validationErrors = validateForm(form, ui);
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

    const msg = ui.waMessageTemplate
      .replace("{naam}", safe.naam)
      .replace("{email}", safe.email)
      .replace("{telefoon}", safe.telefoon || "—")
      .replace("{interesse}", interesse)
      .replace("{bericht}", safe.bericht)
      + (safe.datum ? `\n${ui.labelDatum}: ${safe.datum}${safe.tijd ? ` ${safe.tijd}` : ""}` : "");

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
    <section ref={sectionRef} id="contact" className="py-12 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          style={{ opacity: 0 }}
          className="text-center mb-8 sm:mb-14"
        >
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
            {siteContent.ui.sections.contact}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {ui.heading}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            {ui.subheading}
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
                {ui.infoSubheading}
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
                  <span className="text-white font-semibold">{ui.personalAdviceTitle}</span>{" "}
                  {ui.personalAdviceText}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-white font-semibold">{ui.fastReplyTitle}</span>{" "}
                  {ui.fastReplyText}
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
                  {ui.successTitle}
                </h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  {ui.successMsg}
                </p>
              </m.div>
            ) : (
              <m.form
                key="form"
                ref={formScope}
                onSubmit={handleSubmit}
                noValidate
                initial={false}
                aria-label={ui.formAriaLabel}
                className="bg-slate-50 rounded-3xl p-8 lg:p-10 border border-slate-100"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {ui.formTitle}
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="naam" className="block text-sm font-medium text-slate-700 mb-1.5">
                      {ui.labelNaam} <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="naam"
                      name="naam"
                      value={form.naam}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={ui.namePlaceholder}
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
                      {ui.labelEmail} <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={ui.emailPlaceholder}
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
                      {ui.labelTelefoon}
                    </label>
                    <Input
                      id="telefoon"
                      name="telefoon"
                      type="tel"
                      value={form.telefoon}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={ui.phonePlaceholder}
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
                        {ui.labelDatum}
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
                        {ui.labelTijd}
                      </label>
                      <select
                        id="tijd"
                        name="tijd"
                        value={form.tijd}
                        onChange={(e) => setForm({ ...form, tijd: e.target.value })}
                        aria-label={ui.labelTijd}
                        className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                      >
                        <option value="">{ui.kiesTijd}</option>
                        {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div data-field style={{ opacity: 0 }}>
                    <label htmlFor="bericht" className="block text-sm font-medium text-slate-700 mb-1.5">
                      {ui.labelBericht} <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="bericht"
                      name="bericht"
                      value={form.bericht}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={ui.messagePlaceholder}
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
                        {ui.labelInteresse}
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
                    aria-label={ui.whatsappAria}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-400/20 gap-2"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        {ui.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" />
                        {ui.sendButton}
                      </>
                    )}
                  </Button>
                </m.div>

                <p className="text-slate-400 text-xs text-center mt-3">
                  {ui.formFooter}{" "}
                  <a
                    href={`tel:${telefoonLink}`}
                    className="text-brand-600 hover:underline"
                    onClick={() => track("contact_phone_click")}
                  >
                    {ui.callUs}
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
