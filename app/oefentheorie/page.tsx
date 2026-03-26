import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BookOpen, Trophy, Clock, Target } from "lucide-react";

export const metadata = {
  title: "Online Praktijk | Rijschool Rij2Go",
  description: "Oefen voor je theorie-examen met onze interactieve online oefenvragen.",
};

export default function OefenoefeniePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/80 via-slate-900 to-slate-900" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Online Praktijk
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Oefen voor je{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
              theorie-examen
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Haal meer uit je rijlessen door ook online te oefenen.
            Onze interactieve oefenvragen bereiden je optimaal voor op het CBR-examen.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: BookOpen, label: "Vragen", value: "500+" },
              { icon: Trophy, label: "Slagingspercentage", value: "96%" },
              { icon: Clock, label: "Oefentijd", value: "Onbeperkt" },
              { icon: Target, label: "Categorieën", value: "12" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 text-brand-400 mb-1" />
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-slate-500 text-xs">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Game area */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Placeholder game container */}
          <div className="bg-white rounded-3xl border-2 border-dashed border-brand-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-b from-brand-50 to-white min-h-[520px] flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-brand-100 rounded-3xl flex items-center justify-center mb-8">
                <BookOpen className="w-12 h-12 text-brand-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Game wordt binnenkort geladen
              </h2>
              <p className="text-slate-500 text-base max-w-md mb-8">
                De interactieve oefenomgeving wordt hier geplaatst.
                Je kunt hier straks oefenvragen maken voor het CBR-examen.
              </p>

              {/* Placeholder iframe area */}
              <div className="w-full max-w-2xl bg-slate-100 rounded-2xl border border-slate-200 h-64 flex items-center justify-center">
                <p className="text-slate-400 text-sm font-mono">[ Game / iframe komt hier ]</p>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: BookOpen,
                title: "Gevarieerde vragen",
                desc: "Oefen met echte CBR-stijl vragen over gevaarherkenning, verkeersregels en rijgedrag.",
              },
              {
                icon: Target,
                title: "Direct feedback",
                desc: "Na elk antwoord zie je direct of het goed of fout is, met uitleg waarom.",
              },
              {
                icon: Trophy,
                title: "Bijhouden voortgang",
                desc: "Zie jouw score en voortgang per categorie en weet waar je nog extra op moet oefenen.",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
