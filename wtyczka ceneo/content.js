(() => {
  'use strict';

  // ========================================================================
  // KONFIGURACJA - dostosuj do siebie
  // ========================================================================
  // Uwaga: w Twoim linku był placeholder ":endpoint" - MockAPI wymaga
  // konkretnej nazwy zasobu (np. "products", "produkty" itp.), którą
  // wcześniej definiujesz w panelu MockAPI. Podmień poniżej "produkty"
  // na nazwę zasobu, którą utworzyłeś w swoim projekcie MockAPI.
  const CONFIG = {
    API_URL: 'https://64a28d62b45881cc0ae55762.mockapi.io/products',
    BUTTON_TEXT: 'Zapisz do bazy',
    BUTTON_ID: 'zapisz-do-bazy-btn'
  };

  // ========================================================================
  // POMOCNICZE FUNKCJE
  // ========================================================================

  /**
   * Zamienia tekst ceny w formacie polskim (np. "3 000,00 zł", "1 299,99 zł")
   * na czystą liczbę (np. 3000, 1299.99).
   */
  function parsePrice(rawText) {
    if (!rawText) return null;

    let text = rawText
      .replace(/\u00a0/g, ' ')   // twarde spacje -> zwykłe spacje
      .trim();

    // Usuwamy walutę i inne znaki, zostawiamy cyfry, spacje, przecinki, kropki
    text = text.replace(/[^\d,.\s]/g, '');

    // Usuwamy spacje używane jako separator tysięcy: "3 000,00" -> "3000,00"
    text = text.replace(/\s+/g, '');

    // Zamieniamy przecinek dziesiętny na kropkę: "3000,00" -> "3000.00"
    text = text.replace(',', '.');

    const value = parseFloat(text);
    return Number.isNaN(value) ? null : value;
  }

  /**
   * Próbuje wyciągnąć nazwę produktu z kilku możliwych miejsc na stronie
   * (struktura Ceneo bywa zmieniana, więc sprawdzamy kilka wariantów).
   */
  function getProductName() {
    const selectors = [
      'h1[data-testid="product-name"]',
      'h1.product-top__product-info__name',
      '.product-top h1',
      'h1'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }

    // Ostateczny fallback - tytuł karty
    return document.title.split(' - ')[0].trim();
  }

  /**
   * Próbuje wyciągnąć cenę produktu. Najpierw szuka danych ustrukturyzowanych
   * (meta itemprop="price"), a jeśli ich brak, szuka widocznych elementów z ceną.
   */
  function getProductPrice() {
    // 1. Dane ustrukturyzowane (schema.org) - najbardziej niezawodne
    const metaPrice = document.querySelector('meta[itemprop="price"]');
    if (metaPrice && metaPrice.content) {
      const parsed = parsePrice(metaPrice.content);
      if (parsed !== null) return parsed;
    }

    // 2. Popularne selektory widocznej ceny na Ceneo
    const selectors = [
      '[data-testid="price-value"]',
      '.product-price__value',
      '.price-format',
      '.js_price-value',
      '[itemprop="price"]'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        const parsed = parsePrice(el.textContent);
        if (parsed !== null) return parsed;
      }
    }

    return null;
  }

  /**
   * Znajduje element, obok którego wstawimy przycisk (blisko nazwy produktu).
   */
  function getInsertionAnchor() {
    const selectors = [
      'h1[data-testid="product-name"]',
      'h1.product-top__product-info__name',
      '.product-top h1',
      'h1'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  // ========================================================================
  // OBSŁUGA PRZYCISKU
  // ========================================================================

  async function handleClick(button) {
    const originalText = CONFIG.BUTTON_TEXT;
    button.disabled = true;
    button.classList.remove('zdb-success', 'zdb-error');
    button.textContent = 'Zapisywanie...';

    const name = getProductName();
    const price = getProductPrice();

    if (!name || price === null) {
      button.textContent = 'Nie znaleziono danych';
      button.classList.add('zdb-error');
      setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.classList.remove('zdb-error');
      }, 2500);
      return;
    }

    const payload = {
      name: name,
      price: price,
      url: window.location.href,
      savedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      button.textContent = 'Zapisano ✓';
      button.classList.add('zdb-success');
    } catch (err) {
      console.error('[Zapisz do bazy] Błąd wysyłki:', err);
      button.textContent = 'Błąd zapisu';
      button.classList.add('zdb-error');
    } finally {
      setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.classList.remove('zdb-success', 'zdb-error');
      }, 2500);
    }
  }

  // ========================================================================
  // WSTRZYKNIĘCIE PRZYCISKU
  // ========================================================================

  function injectButton() {
    if (document.getElementById(CONFIG.BUTTON_ID)) return; // już istnieje

    const anchor = getInsertionAnchor();
    if (!anchor) return;

    const button = document.createElement('button');
    button.id = CONFIG.BUTTON_ID;
    button.type = 'button';
    button.textContent = CONFIG.BUTTON_TEXT;
    button.addEventListener('click', () => handleClick(button));

    anchor.insertAdjacentElement('afterend', button);
  }

  // Strony produktowe Ceneo bywają renderowane dynamicznie, dlatego
  // próbujemy wstrzyknąć przycisk od razu i obserwujemy zmiany w DOM.
  injectButton();

  const observer = new MutationObserver(() => {
    injectButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();