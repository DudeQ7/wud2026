// Zgoda na analitykę (§6.18). Dopóki użytkownik nie wybierze, PostHog nie startuje.
// Klucz jest prosty i lokalny – w prototypie nie ma backendu zgód.

export type ConsentValue = "analytics" | "essential";

const KEY = "fs-consent";
export const CONSENT_EVENT = "fs-consent-change";

export function readConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "analytics" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Prywatne okno lub zablokowany storage – zgoda obowiązuje tylko w tej sesji.
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}
