"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import nlContent from "@/data/content.json";
import enContent from "@/data/content-en.json";

type Lang = "nl" | "en";
type Content = typeof nlContent;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  content: Content;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("nl");
  const content = lang === "nl" ? nlContent : (enContent as unknown as Content);
  return (
    <LanguageContext.Provider value={{ lang, setLang, content }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useContent() {
  return useLanguage().content;
}
