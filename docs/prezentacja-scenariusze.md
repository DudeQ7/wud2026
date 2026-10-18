# Scenariusze do prezentacji

Skrypt do krótkiego demo i zapis próby w lokalnym podglądzie (`:3100`, 18.10.2026).

## A. Debiutant — telefon, 360 px

**Cel:** od „nie znam się na muzyce klasycznej” do wyboru wydarzenia i informacji przed wizytą.

1. Otwórz `/zacznij-tutaj` i wybierz **Pomóż mi wybrać**.
2. Odpowiedz na pięć pytań albo pomiń te, które nie są potrzebne.
3. Wybierz propozycję. Pokaż krótki opis i informacje o dostępności.
4. Otwórz kartę wydarzenia i pokaż przyciski zakupu i dodania do kalendarza.
5. Przejdź do **Planuj wizytę** i pokaż dojazd, kontakt z kasą oraz odpowiedzi dla osoby pierwszy raz w Filharmonii.

**Punkt demo:** użytkownik nie musi znać nazw kompozytorów ani zasad koncertu, żeby znaleźć wydarzenie i zaplanować przyjście.

**Próba:** przeszłam kreator i otworzyłam kartę „FilHERmonia — Oda do młodości” przy szerokości 360 px. Karta ma zakup, 1-minutowy odsłuch fragmentu (próbka demo przy utworze w programie), „Dlaczego warto przyjść”, dostępność, FAQ dla debiutanta i dodanie do kalendarza (.ics). Nie otwierano płatności.

## B. Rodzic — telefon, 390 px

**Cel:** znaleźć wydarzenie dla pięciolatka na najbliższy weekend.

1. Otwórz `/repertuar`.
2. Ustaw **Ten weekend**, **Dla dzieci** i wiek 5 lat.
3. Porównaj propozycje po wieku, czasie trwania, cenie i sposobie udziału.
4. Otwórz pasujące wydarzenie i pokaż dostępność oraz przycisk zakupu lub zapisów.

**Punkt demo:** repertuar pomaga ocenić, czy wydarzenie pasuje do rodziny, zanim rodzic otworzy szczegóły.

**Próba:** filtry weekend + dzieci + wiek 5 lat zwróciły jedno wydarzenie („Jak w baroku brzmiały pory roku?”, 5+) z odsłuchem demo, dostępnością i przyciskiem zakupu.

## C. Pytanie do asystenta — telefon lub desktop

**Cel:** dostać odpowiedź o najbliższym koncercie i przejść do działania.

1. Otwórz `/asystent` albo ikonę **Asystent**.
2. Zapytaj: „Jaki koncert jest w sobotę? Czy sala jest dostępna dla osoby na wózku?”.
3. Pokaż kartę wydarzenia, źródło informacji i przyciski do szczegółów oraz biletów.
4. Przy braku informacji pokaż odpowiedź asystenta kierującą do kasy.

**Punkt demo:** asystent podaje źródło i prowadzi do karty wydarzenia, zamiast zgadywać.

**Próba:** działa. Nakładka otwiera się z heksagonu (mobile i desktop) oraz na `/asystent`, asystent odpowiada z kartami wydarzeń i źródłem, a przy pytaniu o dane osobowe odmawia ich przyjęcia i odsyła do kasy (potwierdzone 18.10.2026).

## D. Turysta z Niemiec — telefon, 360 px

**Cel:** sprawdzić po niemiecku terminy, cenę i zasady zwiedzania budynku.

1. Otwórz `/de/zwiedzanie`.
2. Pokaż kluczowe fakty (cena 30/20 zł, czas ok. 45 min, języki PL/EN/DE, kontakt dla grup) oraz 4 nadchodzące terminy zwiedzania po niemiecku.
3. Przejdź do karty zwiedzania albo wieczornego repertuaru (`/de/repertuar`).

**Próba:** `/de/zwiedzanie` przy 360 px wyświetla pełne informacje po niemiecku (`Führungen`), 4 terminy i ceny 30/20 zł.

## Lista przed pokazem

- Otworzyć te trasy w przeglądarce przy szerokości 360–390 px; dla asystenta przygotować też widok desktopowy.
- Sprawdzić, że wybory kreatora i filtry zachowują się po użyciu „Wstecz”.
- Zatrzymać demo przed przejściem do zewnętrznej płatności.
- Jeśli brak wyników lub nie działa audio, pokazać widoczny stan interfejsu i opisać go, bez dopowiadania niepotwierdzonych danych.
