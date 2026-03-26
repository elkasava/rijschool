"use client";

import { useState } from "react";
import { m } from "framer-motion";
import {
  Brain,
  HeartHandshake,
  Settings2,
  Globe,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import content from "@/data/content.json";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  HeartHandshake,
  Settings2,
  Globe,
};

const items = content.specialeBegeleiding.map((item) => ({
  ...item,
  Icon: iconMap[item.icon] ?? Brain,
}));

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SpecialeBegeleiding() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Voor iedereen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Rijlessen op maat
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Iedereen leert anders. Of je nu rijangst hebt, ADHD, liever automatisch rijdt
            of les wilt in het Engels — bij Rij2Go vind je altijd een passende aanpak.
          </p>
        </m.div>

        {/* Cards grid */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
        >
          {items.map((item, i) => {
            const { Icon } = item;
            const isOpen = openIndex === i;
            return (
              <m.div
                key={item.title}
                variants={itemVariants}
                className={`group relative rounded-2xl border ${item.border} ${item.bg} overflow-hidden`}
              >
                {/* Mobile: tappable header row */}
                <button
                  className="sm:hidden w-full flex items-center gap-4 p-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border ${item.border}`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-xs font-semibold ${item.color} mb-0.5`}>
                      {item.tag}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Mobile: expandable description */}
                {isOpen && (
                  <p className="sm:hidden text-slate-600 text-sm leading-relaxed px-6 pb-5">
                    {item.description}
                  </p>
                )}

                {/* Desktop: full card always visible */}
                <div className="hidden sm:flex gap-6 items-start p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center border ${item.border}`}>
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-xs font-semibold ${item.color} mb-2`}>
                      {item.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </m.div>
            );
          })}
        </m.div>

        {/* CTA strip */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-slate-900 rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-white font-semibold text-lg">
              Heb je een specifieke vraag of bijzondere situatie?
            </p>
            <p className="text-slate-400 text-sm mt-0.5">
              We denken graag met je mee — geheel vrijblijvend.
            </p>
          </div>
          <a
            href={`https://wa.me/${content.algemeen.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg shadow-emerald-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Stuur een WhatsApp
          </a>
        </m.div>

      </div>
    </section>
  );
}
