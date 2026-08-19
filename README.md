# MockAPI Products Dashboard

Nowoczesna aplikacja React + Vite + Tailwind CSS do pobierania i zarządzania listą produktów z MockAPI.

## PL — Polski

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
git clone <URL_TWOJEGO_REPOZYTORIUM>
cd mockapi-products-dashboard
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
https://64a28d62b45881cc0ae55762.mockapi.io/products
```

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

### GitHub Pages

Projekt używa `base: "./"` w `vite.config.js`, dzięki czemu nie trzeba wpisywać na sztywno nazwy repozytorium.

1. Utwórz repozytorium na GitHubie.
2. Wypchnij kod:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <URL_TWOJEGO_REPOZYTORIUM>
git push -u origin main
```

3. Zainstaluj zależności:

```bash
npm install
```

4. Opublikuj:

```bash
npm run deploy
```

Skrypt wykona:

```text
npm run build
gh-pages -d dist
```

5. Na GitHubie wejdź w:

`Settings → Pages`

i jako źródło wybierz branch `gh-pages`.

Adres strony będzie miał postać:

```text
https://TWOJ-LOGIN.github.io/NAZWA-REPOZYTORIUM/
```

> Alternatywnie możesz skonfigurować GitHub Actions i automatyczny deployment po każdym pushu. Obecny projekt zawiera prosty deployment przez pakiet `gh-pages`.

---

## EN — English

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
https://64a28d62b45881cc0ae55762.mockapi.io/products
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

### GitHub Pages

The project uses `base: "./"` in `vite.config.js`, so the repository name does not have to be hard-coded.

1. Create a GitHub repository.
2. Push the project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_REPOSITORY_URL>
git push -u origin main
```

3. Install dependencies:

```bash
npm install
```

4. Deploy:

```bash
npm run deploy
```

The command runs:

```text
npm run build
gh-pages -d dist
```

5. On GitHub open:

`Settings → Pages`

and select the `gh-pages` branch as the deployment source.

Your website will be available at:

```text
https://YOUR-USERNAME.github.io/REPOSITORY-NAME/
```

> You can also configure GitHub Actions for automatic deployment after every push. The current project uses the simple `gh-pages` deployment method.
