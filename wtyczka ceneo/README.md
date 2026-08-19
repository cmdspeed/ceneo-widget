# Ceneo - Zapisz do bazy

Wtyczka Chrome (Manifest V3), która na stronach produktowych ceneo.pl dodaje
przycisk **„Zapisz do bazy”**. Kliknięcie pobiera nazwę produktu i cenę
(jako czystą liczbę), a następnie wysyła je metodą POST do MockAPI.


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


