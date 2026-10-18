import Link from "next/link"

import { Eyebrow } from "@/components/fs/layout"
import { buttonVariants } from "@/components/ui/button"
import { firstVisitRoute } from "@/content/home"
import { type Locale, getDictionary, localizedPath } from "@/i18n"
import { cn } from "@/lib/utils"

/** „Pierwsza wizyta w trzech krokach”: trasa po budynku, tekst bez ilustracji (design.md §5.4) */
export function FirstVisitRoute({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).home.discover.route
  return (
    <div className="mb-10 lg:mb-12">
      <Eyebrow>{t.eyebrow}</Eyebrow>
      <h3 id="pierwsza-wizyta" className="type-h3 mt-1 text-gold">
        {t.title}
      </h3>
      <ol className="mt-4 grid gap-6 lg:grid-cols-3 lg:gap-6">
        {firstVisitRoute.map(({ key, href }, i) => {
          const step = t.steps[key]
          return (
            <li key={key} className="flex flex-col gap-2 border-t-[1.5px] border-line-strong pt-4">
              <span className="block font-heading text-[2rem] leading-none font-semibold text-text tabular-nums" aria-hidden="true">
                {i + 1}
              </span>
              <h4 className="type-h4 text-text">
                <span className="sr-only">{i + 1}. </span>
                {step.title}
              </h4>
              <p className="type-body max-w-[52ch] text-text">{step.text}</p>
              <Link href={localizedPath(lang, href)} className={cn(buttonVariants({ variant: "link" }), "w-fit")}>
                {step.link} →
              </Link>
            </li>
          )
        })}
      </ol>
      <p className="mt-6 type-meta max-w-[68ch] text-text-muted">{t.tour}</p>
      <Link href={localizedPath(lang, "/zwiedzanie")} className={cn(buttonVariants({ variant: "secondary", block: true }), "mt-3 sm:w-fit")}>
        {t.tourLink}
      </Link>
    </div>
  )
}
