# Ceneo - Zapisz do bazy

Wtyczka Chrome (Manifest V3), która na stronach produktowych ceneo.pl dodaje
przycisk **„Zapisz do bazy”**. Kliknięcie pobiera nazwę produktu i cenę
(jako czystą liczbę), a następnie wysyła je metodą POST do MockAPI.

## Struktura plików

```
ceneo-extension/
├── manifest.json   – konfiguracja wtyczki (Manifest V3)
├── content.js      – logika: wykrywanie danych produktu + wysyłka POST
├── content.css     – styl przycisku
└── icon16/48/128.png – ikony wtyczki (dorzuć własne, patrz niżej)
```

## Konfiguracja przed instalacją

1. Otwórz plik `content.js` i w sekcji `CONFIG` na górze pliku ustaw
   właściwy adres MockAPI:

   ```js
   API_URL: 'https://64a28d62b45881cc0ae55762.mockapi.io/produkty',
   ```

   **Ważne:** w Twoim oryginalnym linku endpoint był podany jako
   `:endpoint` – to placeholder, a nie prawdziwa nazwa zasobu. W MockAPI
   musisz najpierw w panelu projektu utworzyć zasób (np. „produkty” albo
   „products”) i wtedy dopiero pod tą nazwą będzie działał POST, np.:
   `https://64a28d62b45881cc0ae55762.mockapi.io/products`

2. (Opcjonalnie) Dodaj własne ikony `icon16.png`, `icon48.png`,
   `icon128.png` w katalogu wtyczki, albo usuń sekcję `"icons"` z
   `manifest.json`, jeśli nie chcesz ich dodawać.

## Instalacja w Chrome

1. Wejdź na `chrome://extensions`.
2. Włącz **Tryb dewelopera** (przełącznik w prawym górnym rogu).
3. Kliknij **Wczytaj rozpakowane** i wskaż folder `ceneo-extension`.
4. Wejdź na dowolną stronę produktu na ceneo.pl – pod nazwą produktu
   powinien pojawić się pomarańczowy przycisk „Zapisz do bazy”.

## Jak to działa

- **Nazwa produktu** – pobierana z nagłówka `<h1>` strony (z kilkoma
  wariantami selektorów jako fallback, na wypadek zmian w HTML Ceneo).
- **Cena** – w pierwszej kolejności pobierana z danych ustrukturyzowanych
  (`<meta itemprop="price">`), a jeśli ich nie ma – z widocznego elementu
  ceny na stronie. Tekst typu `"3 000,00 zł"` jest zamieniany na liczbę
  `3000` (funkcja `parsePrice` w `content.js`).
- **Wysyłka** – `fetch(POST)` na adres z `CONFIG.API_URL`, z ciałem JSON:

  ```json
  {
    "name": "Nazwa produktu",
    "price": 3000,
    "url": "https://www.ceneo.pl/...",
    "savedAt": "2026-08-19T12:00:00.000Z"
  }
  ```

- Przycisk podczas wysyłki jest zablokowany i pokazuje status
  (zielony = sukces, czerwony = błąd).

## Uwaga dot. selektorów HTML

Ceneo, jak większość dużych serwisów e-commerce, może zmieniać strukturę
HTML swoich stron bez zapowiedzi. Skrypt próbuje kilku selektorów po
kolei (nazwa produktu, cena), ale jeśli po jakimś czasie przycisk przestanie
poprawnie wykrywać dane, najprościej jest:

1. Otworzyć narzędzia deweloperskie (F12) na stronie produktu.
2. Sprawdzić aktualny selektor elementu z nazwą/ceną.
3. Dopisać go na początku odpowiedniej listy `selectors` w `content.js`.
