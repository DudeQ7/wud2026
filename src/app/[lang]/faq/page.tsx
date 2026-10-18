import type { Metadata } from "next"
import Link from "next/link"

import { Answer } from "@/components/fs/answer"
import { SimplePage } from "@/components/fs/simple-page"
import { buttonVariants } from "@/components/ui/button"
import { faqGroups, faqPage } from "@/content/faq"
import { boxOffice } from "@/content/home"
import visit from "@/data/visit.json"
import { hasLocale, locales, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return {
    ...faqPage[lang].meta,
    alternates: {
      canonical: localizedPath(lang, "/faq"),
      languages: Object.fromEntries(locales.map((code) => [code, localizedPath(code, "/faq")])),
    },
  }
}

/**
 * Najczęstsze pytania: grupy w kolejności wizyty (bilet → dojazd → przed koncertem → sala → dostępność → budynek),
 * odpowiedzi w akordeonach jak w „Planuj wizytę” (§7.3). Dane strukturalne FAQPage dla wyszukiwarek i asystentów LLM.
 */
export default async function FaqPage() {
  const lang = await getLang()
  const copy = faqPage[lang]
  const groups = faqGroups(lang)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: [...(item.list ?? []), ...item.a].join(" ") },
      }))
    ),
  }

  return (
    <SimplePage eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} source={visit.source}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Spis grup: na telefonie skok do tematu zamiast przewijania całej listy */}
      <nav aria-labelledby="faq-spis" className="mt-6">
        <h2 id="faq-spis" className="sr-only">
          {copy.toc}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.id}>
              <a
                href={`#${group.id}`}
                className="flex min-h-11 items-center border-[1.5px] border-line-strong px-3 text-[0.9375rem] font-semibold text-text hover:bg-bg-subtle"
              >
                {group.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {groups.map((group) => (
        <section key={group.id} id={group.id} aria-labelledby={`${group.id}-tytul`} className="mt-10">
          <h2 id={`${group.id}-tytul`} className="type-h2 text-gold">
            {group.title}
          </h2>
          <div className="mt-4 border-t border-line">
            {group.items.map((item) => (
              <Answer key={item.q} title={item.q}>
                {item.list && (
                  <ul className="flex list-disc flex-col gap-1 pl-5">
                    {item.list.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                {item.a.map((text) => (
                  <p key={text} className="whitespace-pre-line">
                    {text}
                  </p>
                ))}
              </Answer>
            ))}
          </div>
        </section>
      ))}

      {/* Stała pomoc (WCAG 3.2.6): gdy odpowiedzi brak – asystent albo kasa */}
      <section aria-labelledby="faq-pomoc" className="mt-12 border-t border-line-strong pt-6">
        <h2 id="faq-pomoc" className="type-h3 text-gold">
          {copy.moreTitle}
        </h2>
        <p className="mt-2 type-body text-text">{copy.moreText}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href={localizedPath(lang, "/asystent")} className={buttonVariants({ variant: "primary" })}>
            {copy.assistant}
          </Link>
          <a href={`tel:${boxOffice.phone.replaceAll(" ", "")}`} className={buttonVariants({ variant: "secondary" })}>
            {copy.call} · {boxOffice.phone}
          </a>
        </div>
      </section>
    </SimplePage>
  )
}
