# MockAPI Products Dashboard

Nowoczesna aplikacja React + Vite + Tailwind CSS do pobierania i zarządzania listą produktów z MockAPI.

adres do testowania LIVE: cmdspeed.github.io/ceneo-widget/

## PL — Polski

## Instalacja w Chrome

1. Wejdź na `chrome://extensions`.
2. Włącz **Tryb dewelopera** (przełącznik w prawym górnym rogu).
3. Kliknij **Wczytaj rozpakowane** i wskaż folder `wtyczka ceneo` znajduje się w głównym folderze na github gotowe do pobrania.
4. Wejdź na dowolną stronę produktu na ceneo.pl – pod nazwą produktu
   powinien pojawić się pomarańczowy przycisk „Zapisz do bazy”.

### Funkcje

- pobieranie produktów metodą `GET` z MockAPI,
- estetyczne, responsywne karty produktów,
- nazwa produktu, cena w zł i link do sklepu,
- sortowanie:
  - cena rosnąco,
  - cena malejąco,
  - alfabetycznie A–Z,
- dynamiczne wyszukiwanie po nazwie,
- statystyki:
  - łączna wartość produktów,
  - średnia cena,
  - najtańszy produkt,
  - najdroższy produkt,
- system budżetu użytkownika,
- produkty w budżecie są oznaczane na zielono,
- produkty ponad budżet są oznaczane na czerwono,
- usuwanie produktu z potwierdzeniem `TAK / NIE`,
- po usunięciu lista jest automatycznie synchronizowana z API,
- przycisk ręcznego odświeżenia listy,
- obsługa błędów i stanu ładowania,
- przygotowanie do publikacji na GitHub Pages.

### Wymagania

- Node.js 18+,
- npm.

### Instalacja

```bash
git clone <URL_REPOZYTORIUM>
cd ceneo-widget
npm install
npm run dev
```

Następnie otwórz adres pokazany przez Vite, zwykle:

```text
http://localhost:5173
```

### Build produkcyjny

```bash
npm run build
```

Podgląd buildu:

```bash
npm run preview
```

### MockAPI

Aplikacja korzysta z:

```text
mockapi.io
```
API jest publiczne i zostanie usunięte 01.01.2027r!
po tym terminie można założyć włase konto i podmienić link używając zmiennych nie publicznych np .ENV


Zakładany format produktu:

```json
{
  "id": "1",
  "name": "Samsung Galaxy A16 SM-A165 4/128GB Czarny",
  "price": 570,
  "url": "https://www.ceneo.pl/178154577;0280-0.htm"
}
```

Kod jest odporny także na pole `link` zamiast `url`.

### Usuwanie produktów

Po kliknięciu ikony kosza aplikacja pokazuje pytanie:

> Czy na pewno chcesz usunąć produkt z listy?

Użytkownik wybiera `NIE` lub `TAK, usuń`.

Po potwierdzeniu wykonywany jest:

```http
DELETE /products/:id
```

Następnie aplikacja odświeża dane z API, dzięki czemu usunięty produkt od razu znika z listy.




## EN — English

Installation in Chrome
Go to chrome://extensions.
Enable Developer mode (the switch in the top-right corner).
Click Load unpacked and select the wtyczka ceneo folder, which is located in the main GitHub folder and is ready to download.
Go to any product page on ceneo.pl – an orange “Save to database” button should appear below the product name.

### Features

- fetch products using `GET` from MockAPI,
- clean and responsive product cards,
- product name, price in PLN and store link,
- sorting:
  - price ascending,
  - price descending,
  - alphabetical A–Z,
- live text search by product name,
- statistics:
  - total product value,
  - average product price,
  - cheapest product,
  - most expensive product,
- user budget system,
- products within budget are highlighted in green,
- products above budget are highlighted in red,
- delete product with `YES / NO` confirmation,
- automatic API synchronization after deletion,
- manual refresh button,
- loading and error states,
- GitHub Pages-ready configuration.

### Requirements

- Node.js 18+,
- npm.

### Installation

```bash
git clone <YOUR_REPOSITORY_URL>
cd mockapi-products-dashboard
npm install
npm run dev
```

Then open the URL displayed by Vite, usually:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### MockAPI

The application uses:

```text
mockapi.io/products
```

Expected product format:

```json
{
  "id": "1",
  "name": "Samsung Galaxy A16 SM-A165 4/128GB Czarny",
  "price": 570,
  "url": "https://www.ceneo.pl/178154577;0280-0.htm"
}
```

The application also accepts `link` as an alternative to `url`.

### Deleting products

Click the trash icon to open the confirmation dialog:

> Are you sure you want to remove this product from the list?

The user can choose `NO` or `YES, delete`.

After confirmation the app sends:

```http
DELETE /products/:id
```

and refreshes the data from the API so the deleted product immediately disappears from the list.

