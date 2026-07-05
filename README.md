# 🗺️ Sommerferie 2026 — Helsingør til Stresa

Familierejse-app til turen fredag 2026-07-17 → søndag 2026-07-19. Virker offline efter første besøg, og deler position/tællere mellem flere enheder (telefoner/tablets) via Firebase.

## Funktioner

- **Eventyrsti** — en stiliseret, snoet vej med alle stop fra rejseplanen. Tryk "Hvor er vi?" og jeres GPS-position sættes på stien (omtrentligt), og I ser hvor lang tid der er til næste stop og til Stresa — beregnet ud fra jeres faktiske position ift. den planlagte tidsplan.
- **Spillere** — hvert familiemedlem opretter sig med navn + eventyr-dyr. Alle enheder ser hinandens position og tællere.
- **Tællere** — IS-knap og TISSE-knap, delt mellem hele familien, med en lille "leaderboard".
- **PokeBror** — tag et billede af broren og "prik" til ham — billedet klemmes sjovere og sjovere sammen for hvert prik.
- **Farvelæg dig selv** — tag en selfie og tegn løs med farver, gem billedet bagefter.

## Kom i gang lokalt

```bash
npm install
npm run dev
```

Appen virker uden Firebase opsat (viser en fejlbesked og springer deling over), men for at få GPS-deling mellem enheder og offline-synkronisering skal I oprette et gratis Firebase-projekt:

### 1. Opret Firebase-projekt (gratis Spark-plan)

1. Gå til [console.firebase.google.com](https://console.firebase.google.com) og opret et nyt projekt (fx "sommerferie2026").
2. Under **Build → Authentication** → fanen "Sign-in method": aktivér **Anonymous**.
3. Under **Build → Firestore Database**: opret en database (vælg en region i Europa, fx `eur3`).
4. Gå til **Project settings → General → Your apps**, tryk "Add app" → vælg web (`</>`), og registrér appen. Kopiér config-værdierne.
5. Under **Firestore Database → Rules**, indsæt indholdet af [`firestore.rules`](firestore.rules) fra dette projekt og publicér.

### 2. Sæt miljøvariabler

Kopiér `.env.example` til `.env.local` og udfyld med værdierne fra Firebase:

```bash
cp .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Genstart `npm run dev` bagefter.

## Deployment (gratis static hosting)

Byg appen:

```bash
npm run build
```

Dette laver en `dist/`-mappe. Nemmeste gratis muligheder:

- **Netlify (drag & drop)**: Gå til [app.netlify.com/drop](https://app.netlify.com/drop) og træk `dist/`-mappen ind. I får et link med det samme.
- **Vercel/Netlify CLI**: kør `npx netlify deploy --prod --dir=dist` (kræver login første gang).

Husk at tilføje de samme `VITE_FIREBASE_*` miljøvariabler i hosting-platformens indstillinger, hvis I bruger CLI/git-baseret deployment (drag & drop bruger den lokale `.env.local` I allerede har bygget med).

## Sådan bruger I appen på turen

1. **Inden afgang** (mens I har WiFi/mobildata derhjemme): åbn linket på alle telefoner/tablets, og opret jer som spillere. Dette cacher hele appen, så den virker uden internet bagefter.
2. **Tilføj til hjemmeskærm** (valgfrit, men anbefales): I browserens menu, vælg "Føj til hjemmeskærm" / "Installer app" — så åbner den som en rigtig app uden adressebar.
3. **Undervejs**: tryk "Hvor er vi?" — det virker med almindelig GPS uden internetforbindelse. Positionen synkroniseres til de andre enheder, når I får forbindelse igen (fx ved ladestop med WiFi, eller almindelig mobildækning).
4. Tællere og PokeBror/Farvelæg-billeder virker 100% offline hele tiden.

## Vigtigt at vide

- Koordinaterne for ladestop/stop er tilnærmede — appen er lavet til sjov og overblik, ikke til turn-by-turn navigation. Brug stadig jeres almindelige GPS/Google Maps til selve kørslen.
- Del ikke app-linket offentligt — der er ingen rigtig login, kun anonym adgang, så alle med linket kan se/tilføje sig som "spiller".
