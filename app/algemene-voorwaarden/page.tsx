import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden – Rijschool Rij2Go",
  description:
    "Lees de algemene voorwaarden van Rijschool Rij2Go voor rijlessen, lespakketten en examens.",
};

const sections = [
  {
    title: "Algemeen",
    content: `Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Rijschool Rij2Go en de leerling met betrekking tot rijlessen (schakel en automaat), lespakketten en examens. Door het afnemen van rijlessen of het aangaan van een overeenkomst verklaart de leerling zich akkoord met deze algemene voorwaarden. Waar deze voorwaarden niet uitdrukkelijk in voorzien, wordt gehandeld naar redelijkheid en billijkheid en naar de geest van deze voorwaarden.`,
  },
  {
    title: "Totstandkoming van de overeenkomst",
    bullets: [
      "De overeenkomst komt tot stand door aanmelding van de leerling en bevestiging daarvan door Rijschool Rij2Go, mondeling, schriftelijk of digitaal.",
      "De leerling is verantwoordelijk voor het verstrekken van juiste en volledige informatie bij inschrijving.",
      "Indien de leerling minderjarig is, dient de overeenkomst te worden aangegaan door een wettelijke vertegenwoordiger.",
    ],
  },
  {
    title: "Verplichtingen van Rijschool Rij2Go",
    intro: "Rijschool Rij2Go draagt er zorg voor dat:",
    bullets: [
      "Rijlessen worden gegeven door instructeurs die voldoen aan de eisen van de Wet Rijonderricht Motorrijtuigen (WRM).",
      "De leerling zoveel mogelijk les krijgt van dezelfde instructeur.",
      "De rijopleiding is gericht op een verantwoorde deelname aan het praktijkexamen bij het CBR.",
      "Rijlessen worden verzorgd in een deugdelijk onderhouden en verzekerd lesvoertuig (schakel of automaat).",
      "Het praktijkexamen na betaling en machtiging tijdig wordt aangevraagd bij het CBR.",
      "Bij het examen gebruik wordt gemaakt van hetzelfde of een gelijkwaardig lesvoertuig als waarin de leerling heeft gelest.",
      "De afgesproken lestijd volledig wordt benut voor rijonderricht.",
      "Indien een rijles door omstandigheden aan de zijde van Rijschool Rij2Go niet kan doorgaan, deze kosteloos wordt verplaatst.",
    ],
  },
  {
    title: "Verplichtingen van de leerling",
    intro: "De leerling verplicht zich:",
    bullets: [
      "Alle aanwijzingen van de rijinstructeur tijdens de rijlessen op te volgen.",
      "Op de afgesproken tijd en plaats aanwezig te zijn voor de rijles.",
      "Tijdens de rijles in het bezit te zijn van een geldig legitimatiebewijs en – indien van toepassing – een geldig theoriecertificaat.",
      "Rijschool Rij2Go tijdig te informeren over medische omstandigheden, medicijngebruik of andere zaken die de rijvaardigheid kunnen beïnvloeden.",
      "Nuchter aan de rijles deel te nemen (geen alcohol, drugs of rijvaardigheid beïnvloedende middelen).",
      "Onverwijld te melden indien sprake is van een rijontzegging of andere wettelijke beperking.",
    ],
  },
  {
    title: "Annuleren van rijlessen",
    bullets: [
      "Een rijles kan kosteloos worden geannuleerd tot uiterlijk 48 uur vóór aanvang van de les.",
      "Annulering binnen 48 uur vóór aanvang van de rijles of het niet verschijnen op de les kan leiden tot het volledig in rekening brengen van de rijles.",
      "Coulance: iedere leerling heeft recht op één kosteloze late annulering per 6 maanden, mits dit tijdig wordt doorgegeven.",
      "In geval van aantoonbare overmacht (zoals acute ziekte of een noodsituatie) kan Rijschool Rij2Go besluiten de rijles niet in rekening te brengen.",
      "Annulering dient persoonlijk te worden doorgegeven aan Rijschool Rij2Go via de afgesproken communicatiemiddelen.",
    ],
  },
  {
    title: "Betaling",
    bullets: [
      "Betaling van rijlessen, lespakketten en examens dient te geschieden conform de afgesproken betalingswijze.",
      "Rijschool Rij2Go behoudt zich het recht voor lesprijzen te wijzigen. Reeds afgesloten lespakketten blijven ongewijzigd, tenzij wettelijke examenkosten worden verhoogd.",
      "Lespakketten zijn persoonlijk, niet overdraagbaar en hebben een geldigheidsduur van 12 maanden, tenzij anders overeengekomen.",
      "Restitutie van niet-genoten lessen uit een lespakket is niet mogelijk, behoudens uitzonderlijke gevallen ter beoordeling van Rijschool Rij2Go.",
      "Bij niet-tijdige betaling is Rijschool Rij2Go gerechtigd rijlessen op te schorten en eventuele administratie- en incassokosten in rekening te brengen.",
    ],
  },
  {
    title: "Praktijkexamen",
    bullets: [
      "Examengelden dienen volledig te zijn voldaan voordat het examen wordt aangevraagd.",
      "Bij het Start Snel pakket is het CBR-praktijkexamen niet inbegrepen in de pakketprijs. De kosten voor het praktijkexamen worden apart in rekening gebracht en dienen door de leerling rechtstreeks of via Rijschool Rij2Go te worden voldaan.",
      "Indien een examen geen doorgang vindt door toedoen van de leerling (zoals te laat verschijnen of ontbreken van geldige documenten), komen alle kosten voor rekening van de leerling.",
      "Tariefwijzigingen van het CBR worden doorberekend aan de leerling.",
    ],
  },
  {
    title: "Aansprakelijkheid en vrijwaring",
    bullets: [
      "Rijschool Rij2Go is verzekerd conform de wettelijke vereisten.",
      "Rijschool Rij2Go is niet aansprakelijk voor schade die voortvloeit uit opzet, grove nalatigheid of het gebruik van alcohol, drugs of verboden middelen door de leerling.",
      "Indien de leerling onjuiste informatie verstrekt over rijbevoegdheid of medische geschiktheid, vrijwaart de leerling Rijschool Rij2Go volledig van alle gevolgen.",
      "Aansprakelijkheid van Rijschool Rij2Go is te allen tijde beperkt tot het bedrag dat door de verzekeraar wordt uitgekeerd.",
    ],
  },
  {
    title: "Beëindiging van de overeenkomst",
    bullets: [
      "Beide partijen kunnen de overeenkomst beëindigen in onderling overleg.",
      "Rijschool Rij2Go kan de overeenkomst beëindigen bij wanbetaling, herhaald wangedrag of het structureel niet nakomen van afspraken.",
      "Reeds betaalde examengelden en genoten rijlessen worden niet gerestitueerd.",
    ],
  },
  {
    title: "Privacy",
    content:
      "Rijschool Rij2Go verwerkt persoonsgegevens uitsluitend in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG) en uitsluitend ten behoeve van de uitvoering van de overeenkomst.",
  },
  {
    title: "Klachten",
    bullets: [
      "Klachten dienen zo spoedig mogelijk, maar uiterlijk binnen 14 dagen, kenbaar te worden gemaakt bij Rijschool Rij2Go.",
      "Rijschool Rij2Go zal de klacht binnen een redelijke termijn behandelen.",
    ],
  },
  {
    title: "Toepasselijk recht",
    content:
      "Op alle overeenkomsten tussen Rijschool Rij2Go en de leerling is uitsluitend Nederlands recht van toepassing.",
  },
];

export default function AlgemeneVoorwaardenPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
          >
            ← Terug naar home
          </Link>
          <span className="inline-block text-brand-400 font-semibold text-xs uppercase tracking-widest mb-3">
            Juridisch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Algemene Voorwaarden
          </h1>
          <p className="text-slate-400 text-sm">
            Rijschool Rij2Go — Versie 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                {section.title}
              </h2>
              {section.intro && (
                <p className="text-slate-600 text-sm mb-2">{section.intro}</p>
              )}
              {section.content && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {section.content}
                </p>
              )}
              {section.bullets && (
                <ul className="space-y-2 mt-2">
                  {section.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
          >
            ← Terug naar home
          </Link>
        </div>
      </div>
    </main>
  );
}
