// Zgoda na analitykę (§6.18). Dopóki użytkownik nie wybierze, PostHog nie startuje.
// Klucz jest prosty i lokalny – w prototypie nie ma backendu zgód.

export type ConsentValue = "analytics" | "essential";

const KEY = "fs-consent";
export const CONSENT_EVENT = "fs-consent-change";

/** Atrybut na <html>, gdy zgody jeszcze nie ma: CSS rezerwuje miejsce na baner od pierwszego malowania */
export const CONSENT_PENDING_ATTR = "data-consent-pending";

/** Skrypt do <head>: ustawia atrybut przed hydratacją, żeby otwarcie strony nie przeskoczyło po pojawieniu się banera */
export const consentPendingScript = `try{var v=localStorage.getItem("${KEY}");if(v!=="analytics"&&v!=="essential")document.documentElement.setAttribute("${CONSENT_PENDING_ATTR}","")}catch(e){document.documentElement.setAttribute("${CONSENT_PENDING_ATTR}","")}`;

// Wybór z tej sesji – gdy storage jest zablokowany, baner i tak się zamyka
let sessionValue: ConsentValue | null = null;

export function readConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "analytics" || value === "essential" ? value : sessionValue;
  } catch {
    return sessionValue;
  }
}

/** Subskrypcja zmian zgody (ta karta i inne karty) – dla useSyncExternalStore */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function writeConsent(value: ConsentValue) {
  sessionValue = value;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Prywatne okno lub zablokowany storage – zgoda obowiązuje tylko w tej sesji.
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}

/** Stopka prosi baner o ponowne otwarcie ustawień (zmiana lub wycofanie zgody) */
export const CONSENT_OPEN_EVENT = "fs-consent-open";

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
