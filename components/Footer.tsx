import Image from "next/image";
import { Heart } from "lucide-react";
import content from "@/data/content.json";

const { schoolNaam } = content.algemeen;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt={schoolNaam}
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-slate-500 text-xs">
            <a href="#pakketten" className="hover:text-white transition-colors">
              Pakketten
            </a>
            <a href="#werkwijze" className="hover:text-white transition-colors">
              Werkwijze
            </a>
            <a href="/oefentheorie" className="hover:text-white transition-colors">
              Online Praktijk
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacybeleid
            </a>
          </div>

          {/* Copyright */}
          <p className="text-slate-600 text-xs flex items-center gap-1">
            © {year} {schoolNaam}. Gemaakt met{" "}
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
