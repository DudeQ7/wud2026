"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Locale, getDictionary } from "@/i18n"

/**
 * Zapis do newslettera (§6.17): etykieta nad polem, „(wymagane)” słowem,
 * błędy bez czerwieni – „Błąd:” + kontur 3 px + aria-describedby. Zapis do listy Supabase przez /api/newsletter.
 */
export function NewsletterForm({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).newsletter
  const id = useId()
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({})
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pending) return
    setSubmitError(false)
    const next = {
      email: /^\S+@\S+\.\S+$/.test(email) ? undefined : t.emailError,
      consent: consent ? undefined : t.consentError,
    }
    setErrors(next)
    if (next.email || next.consent) return
    setPending(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, consent }),
      })
      if (!response.ok) throw new Error("Signup failed")
      setSent(true)
    } catch {
      setSubmitError(true)
    } finally {
      setPending(false)
    }
  }

  if (sent) {
    return (
      <p role="status" className="type-body border-y border-line py-4 text-text">
        {t.thanks}
      </p>
    )
  }

  return (
    <form noValidate aria-busy={pending} onSubmit={onSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-2 pt-2">
        <Label htmlFor={`${id}-email`}>{t.email}</Label>
        <Input
          id={`${id}-email`}
          disabled={pending}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
        />
        {errors.email && (
          <p id={`${id}-email-error`} className="type-meta text-text">
            <strong>{t.error}</strong> {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3 py-2.5">
          <Checkbox
            id={`${id}-consent`}
            disabled={pending}
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
          />
          <Label htmlFor={`${id}-consent`} className="type-meta font-normal">
            {t.consent}{" "}
            <a href="https://filharmonia.szczecin.pl/polityka_prywatnosci" className="font-semibold underline underline-offset-2">
              {t.privacy}
            </a>
          </Label>
        </div>
        {errors.consent && (
          <p id={`${id}-consent-error`} className="type-meta text-text">
            <strong>{t.error}</strong> {errors.consent}
          </p>
        )}
      </div>

      {submitError && <p role="alert" className="type-meta text-text"><strong>{t.error}</strong> {t.submitError}</p>}
      <Button type="submit" disabled={pending} block className="sm:w-fit">
        {pending ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
