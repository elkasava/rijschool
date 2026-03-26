import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pagina niet gevonden | Rijschool Rij2Go",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-md">
          <div className="text-8xl font-bold text-brand-200 mb-4">404</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Pagina niet gevonden
          </h1>
          <p className="text-slate-500 mb-8">
            De pagina die je zoekt bestaat niet of is verplaatst.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Terug naar home
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center bg-white border border-slate-200 hover:border-brand-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Contact opnemen
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
