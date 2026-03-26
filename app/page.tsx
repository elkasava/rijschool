import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Below-fold components loaded lazily — improves initial JS bundle & LCP
const Voordelen = dynamic(() => import("@/components/Voordelen"));
const SpecialeBegeleiding = dynamic(() => import("@/components/SpecialeBegeleiding"));
const Pakketten = dynamic(() => import("@/components/Pakketten"));
const Werkwijze = dynamic(() => import("@/components/Werkwijze"));
const CtaBanner = dynamic(() => import("@/components/CtaBanner"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Voordelen />
      <SpecialeBegeleiding />
      <Pakketten />
      <Werkwijze />
      <CtaBanner />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
