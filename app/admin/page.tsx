"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, LogOut, Plus, Trash2, ChevronDown, ChevronUp, Eye } from "lucide-react";

type Content = {
  algemeen: {
    schoolNaam: string;
    telefoon: string;
    telefoonLink: string;
    email: string;
    whatsapp: string;
    werkgebied: string;
    openingstijden: string;
  };
  hero: {
    beoordeling: string;
    stats: { value: string; label: string }[];
    subtext: string;
    checkmarks: string[];
    autoMerk: string;
    autoType: string;
    autoFeatures: string[];
  };
  pakketten: {
    name: string;
    tag: string;
    price: string;
    priceNote: string;
    lessen: string;
    duration: string;
    description: string;
    features: string[];
    highlight: boolean;
    cta: string;
  }[];
  faq: { vraag: string; antwoord: string }[];
  voordelen: { icon: string; title: string; description: string; color: string; bg: string }[];
  werkwijze: { nummer: string; icon: string; title: string; description: string; details: string[]; color: string }[];
};

type Tab = "algemeen" | "hero" | "pakketten" | "faq" | "voordelen" | "werkwijze";

const TABS: { id: Tab; label: string }[] = [
  { id: "algemeen", label: "Algemeen" },
  { id: "hero", label: "Hero" },
  { id: "pakketten", label: "Pakketten" },
  { id: "faq", label: "FAQ" },
  { id: "voordelen", label: "Voordelen" },
  { id: "werkwijze", label: "Werkwijze" },
];

function Field({ label, value, onChange, multiline = false, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; className?: string;
}) {
  const base = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white";
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${base} resize-y`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </div>
  );
}

function SaveBtn({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        saved ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
      } disabled:opacity-60`}
    >
      <Save className="w-4 h-4" />
      {saving ? "Opslaan..." : saved ? "Opgeslagen ✓" : "Opslaan"}
    </button>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("algemeen");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [storedPw, setStoredPw] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_pw");
    if (stored) { setAuthed(true); setStoredPw(stored); }
  }, []);

  useEffect(() => {
    if (authed) {
      fetch("/api/content").then((r) => r.json()).then(setContent);
    }
  }, [authed]);

  const login = async () => {
    const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (res.ok) {
      sessionStorage.setItem("admin_pw", pw);
      setStoredPw(pw);
      setAuthed(true);
    } else {
      setPwError("Onjuist wachtwoord");
    }
  };

  const save = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": storedPw }, body: JSON.stringify(content) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [content, storedPw]);

  const update = (path: string[], value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as Record<string, unknown>;
      let cur: Record<string, unknown> = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur = cur[path[i]] as Record<string, unknown>;
      }
      cur[path[path.length - 1]] = value;
      return next as Content;
    });
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 w-full max-w-sm">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Save className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 text-center mb-1">Admin Beheer</h1>
          <p className="text-slate-500 text-sm text-center mb-6">Rijschool Rij2Go</p>
          <input
            type="password"
            placeholder="Wachtwoord"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(""); }}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
          />
          {pwError && <p className="text-rose-500 text-xs mb-3">{pwError}</p>}
          <button onClick={login} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
            Inloggen
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <Save className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Admin Beheer</span>
            <span className="text-slate-400 text-sm hidden sm:block">— {content.algemeen.schoolNaam}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs transition-colors">
              <Eye className="w-3.5 h-3.5" /> Website
            </a>
            <button onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthed(false); }} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">

          {/* ALGEMEEN */}
          {activeTab === "algemeen" && (
            <Section title="Algemene Informatie" onSave={save} saving={saving} saved={saved}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Schoolnaam" value={content.algemeen.schoolNaam} onChange={(v) => update(["algemeen", "schoolNaam"], v)} />
                <Field label="Telefoon (weergave)" value={content.algemeen.telefoon} onChange={(v) => update(["algemeen", "telefoon"], v)} />
                <Field label="Telefoon (link, bijv. +31612345678)" value={content.algemeen.telefoonLink} onChange={(v) => update(["algemeen", "telefoonLink"], v)} />
                <Field label="WhatsApp nummer (bijv. 31612345678)" value={content.algemeen.whatsapp} onChange={(v) => update(["algemeen", "whatsapp"], v)} />
                <Field label="E-mailadres" value={content.algemeen.email} onChange={(v) => update(["algemeen", "email"], v)} />
                <Field label="Werkgebied" value={content.algemeen.werkgebied} onChange={(v) => update(["algemeen", "werkgebied"], v)} />
                <Field label="Openingstijden" value={content.algemeen.openingstijden} onChange={(v) => update(["algemeen", "openingstijden"], v)} />
              </div>
            </Section>
          )}

          {/* HERO */}
          {activeTab === "hero" && (
            <Section title="Hero Sectie" onSave={save} saving={saving} saved={saved}>
              <Field label="Beoordeling" value={content.hero.beoordeling} onChange={(v) => update(["hero", "beoordeling"], v)} className="mb-4 max-w-xs" />
              <Field label="Subtekst" value={content.hero.subtext} onChange={(v) => update(["hero", "subtext"], v)} multiline className="mb-6" />

              <h4 className="text-sm font-semibold text-slate-700 mb-3">Statistieken</h4>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {content.hero.stats.map((s, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                    <Field label="Waarde (bijv. 96%)" value={s.value} onChange={(v) => update(["hero", "stats", i.toString(), "value"], v)} className="mb-2" />
                    <Field label="Label" value={s.label} onChange={(v) => update(["hero", "stats", i.toString(), "label"], v)} />
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-slate-700 mb-3">Checkmarks</h4>
              <StringList
                items={content.hero.checkmarks}
                onChange={(items) => update(["hero", "checkmarks"], items)}
                placeholder="Voordeel..."
              />

              <h4 className="text-sm font-semibold text-slate-700 mb-3 mt-6">Lesauto</h4>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Automerk" value={content.hero.autoMerk} onChange={(v) => update(["hero", "autoMerk"], v)} />
                <Field label="Type (bijv. Automaat & Handgeschakeld)" value={content.hero.autoType} onChange={(v) => update(["hero", "autoType"], v)} />
              </div>
              <StringList
                items={content.hero.autoFeatures}
                onChange={(items) => update(["hero", "autoFeatures"], items)}
                placeholder="Feature (bijv. Airco)"
              />
            </Section>
          )}

          {/* PAKKETTEN */}
          {activeTab === "pakketten" && (
            <Section title="Rijpakketten & Prijzen" onSave={save} saving={saving} saved={saved}>
              <div className="space-y-6">
                {content.pakketten.map((p, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-800">{p.name || `Pakket ${i + 1}`}</h4>
                      <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                        <input type="checkbox" checked={p.highlight} onChange={(e) => update(["pakketten", i.toString(), "highlight"], e.target.checked)} className="accent-indigo-600" />
                        Uitgelicht
                      </label>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <Field label="Naam" value={p.name} onChange={(v) => update(["pakketten", i.toString(), "name"], v)} />
                      <Field label="Badge (leeg = geen)" value={p.tag} onChange={(v) => update(["pakketten", i.toString(), "tag"], v)} />
                      <Field label="Prijs (bijv. € 895)" value={p.price} onChange={(v) => update(["pakketten", i.toString(), "price"], v)} />
                      <Field label="Prijsnoot (bijv. incl. BTW)" value={p.priceNote} onChange={(v) => update(["pakketten", i.toString(), "priceNote"], v)} />
                      <Field label="Aantal lessen (bijv. 25 rijlessen)" value={p.lessen} onChange={(v) => update(["pakketten", i.toString(), "lessen"], v)} />
                      <Field label="Duur (bijv. à 60 minuten)" value={p.duration} onChange={(v) => update(["pakketten", i.toString(), "duration"], v)} />
                      <Field label="CTA knoptekst" value={p.cta} onChange={(v) => update(["pakketten", i.toString(), "cta"], v)} />
                    </div>
                    <Field label="Beschrijving" value={p.description} onChange={(v) => update(["pakketten", i.toString(), "description"], v)} multiline className="mb-4" />
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Inbegrepen</h5>
                    <StringList
                      items={p.features}
                      onChange={(items) => update(["pakketten", i.toString(), "features"], items)}
                      placeholder="Feature..."
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* FAQ */}
          {activeTab === "faq" && (
            <Section title="Veelgestelde Vragen" onSave={save} saving={saving} saved={saved}>
              <div className="space-y-4">
                {content.faq.map((item, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-md px-2 py-1">#{i + 1}</span>
                      <button
                        onClick={() => update(["faq"], content.faq.filter((_, j) => j !== i))}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Field label="Vraag" value={item.vraag} onChange={(v) => update(["faq", i.toString(), "vraag"], v)} className="mb-3" />
                    <Field label="Antwoord" value={item.antwoord} onChange={(v) => update(["faq", i.toString(), "antwoord"], v)} multiline />
                  </div>
                ))}
              </div>
              <button
                onClick={() => update(["faq"], [...content.faq, { vraag: "", antwoord: "" }])}
                className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Vraag toevoegen
              </button>
            </Section>
          )}

          {/* VOORDELEN */}
          {activeTab === "voordelen" && (
            <Section title="Voordelen" onSave={save} saving={saving} saved={saved}>
              <div className="space-y-4">
                {content.voordelen.map((v, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">{v.title || `Voordeel ${i + 1}`}</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="Titel" value={v.title} onChange={(val) => update(["voordelen", i.toString(), "title"], val)} />
                      <Field label="Icon (Heart/Trophy/Zap/Shield/Clock/ThumbsUp)" value={v.icon} onChange={(val) => update(["voordelen", i.toString(), "icon"], val)} />
                    </div>
                    <Field label="Beschrijving" value={v.description} onChange={(val) => update(["voordelen", i.toString(), "description"], val)} multiline className="mt-3" />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* WERKWIJZE */}
          {activeTab === "werkwijze" && (
            <Section title="Werkwijze Stappen" onSave={save} saving={saving} saved={saved}>
              <div className="space-y-4">
                {content.werkwijze.map((stap, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Stap {stap.nummer}: {stap.title}</h4>
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <Field label="Titel" value={stap.title} onChange={(v) => update(["werkwijze", i.toString(), "title"], v)} />
                      <Field label="Nummer (bijv. 01)" value={stap.nummer} onChange={(v) => update(["werkwijze", i.toString(), "nummer"], v)} />
                    </div>
                    <Field label="Beschrijving" value={stap.description} onChange={(v) => update(["werkwijze", i.toString(), "description"], v)} multiline className="mb-3" />
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Details badges</h5>
                    <StringList
                      items={stap.details}
                      onChange={(items) => update(["werkwijze", i.toString(), "details"], items)}
                      placeholder="Detail..."
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

        </div>
      </div>
    </div>
  );
}

function Section({ title, children, onSave, saving, saved }: {
  title: string; children: React.ReactNode; onSave: () => void; saving: boolean; saved: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
      {children}
      <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
}

function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => { const next = [...items]; next[i] = e.target.value; onChange(next); }}
            placeholder={placeholder}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-300 hover:text-rose-500 transition-colors p-2">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-500 text-sm font-medium">
        <Plus className="w-3.5 h-3.5" /> Toevoegen
      </button>
    </div>
  );
}
