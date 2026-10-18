"use client"

import { type Locale, getDictionary } from "@/i18n"
import { openConsentSettings } from "@/lib/consent"

export const PRIVACY_BUTTON_ID = "ustawienia-prywatnosci"

/** Stopka (§6.18): ponownie otwiera ustawienia zgód, żeby można je było zmienić lub wycofać */
export function PrivacySettingsButton({ lang }: { lang: Locale }) {
  return (
    <button
      id={PRIVACY_BUTTON_ID}
      type="button"
      onClick={openConsentSettings}
      className="flex min-h-11 w-fit cursor-pointer items-center font-semibold underline underline-offset-4 hover:no-underline"
    >
      {getDictionary(lang).consent.manage}
    </button>
  )
}
