import { type Locale, getDictionary } from "@/i18n";

/** Nagłówek podstrony panelu: eyebrow + złoty H1 + lead (jak SimplePage) */
export function PanelHeading({ lang, title, intro }: { lang: Locale; title: string; intro?: string }) {
  return (
    <div className="mb-6 lg:mb-8">
      <p className="type-eyebrow text-gold">{getDictionary(lang).panel.title}</p>
      <h1 className="mt-1 type-h1 text-gold">{title}</h1>
      {intro && <p className="mt-2 max-w-[68ch] type-body-lg text-text">{intro}</p>}
    </div>
  );
}
