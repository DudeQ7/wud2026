import { initAnalytics } from "@/lib/analytics";
import { readConsent } from "@/lib/consent";

// Analityka rusza tylko wtedy, gdy użytkownik wcześniej zaakceptował ją w banerze.
if (readConsent() === "analytics") initAnalytics();
