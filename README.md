# KitchenPrime

Boutique e-commerce multilingue (FR · DE · IT · EN) : **Thermomix TM7 reconditionné**, accessoires, livres de recettes, packs et **maison connectée / électroménager**.

Stack : **Next.js 14 (App Router) · Prisma + PostgreSQL · NextAuth · next-intl · Tailwind CSS · Stripe / Mollie / Adyen / SumUp · Nodemailer · pdfkit**.

---

## 🚀 Démarrage rapide

```bash
npm install
cp .env.example .env      # puis renseigner DATABASE_URL, NEXTAUTH_SECRET, SMTP_*
npm run db:push           # crée le schéma
npm run db:seed           # 20 produits + compte admin
npm run dev               # http://localhost:3000
```

---

## 🗂️ Arborescence

```
app/
  [locale]/            pages publiques i18n (fr|de|it|en)
    page.tsx           accueil — hero 3D, confiance, populaires, avis
    catalogue/         20 produits, filtres par catégorie, recherche
    produit/[slug]/    fiche produit (contenu traduit + JSON-LD Product)
    panier/            panier persistant
    favoris/           liste d'envies
    checkout/          tunnel de commande
    cgv/ mentions-legales/ politique-retour/ contact/
    opengraph-image.tsx  vignette de partage générée par locale
  admin/               espace privé (non listé)
  api/                 commandes, webhooks paiement, PDF, WhatsApp
  robots.ts · sitemap.ts · manifest.ts
components/
  layout/  TopBar · Header · Footer · WhatsAppFloat
  shop/    Hero · TrustStrip · ProductCard · CatalogGrid · CartProvider ·
           CartView · WishlistView · PDPGallery · PDPActions · CheckoutForm
  ui/      Icon (sprite SVG généré) · RemoteImage
  seo/     JsonLd
  legal/   LegalArticle · RichText
content/legal/         CGV, mentions, retours, contact — dans les 4 langues
lib/
  products.ts          catalogue canonique (prix, réf., images)
  product-content.ts   textes produit traduits (nom, accroche, description)
  catalog-view.ts      assemblage produit + traduction pour l'affichage
  seo.ts               métadonnées, hreflang, JSON-LD
  i18n.ts              constantes de locale
  i18n-request.ts      configuration next-intl
messages/              fr · de · it · en
tests/
  unit/                Vitest — catalogue, i18n, SEO
  e2e/                 Playwright — parcours, SEO, performance, responsive
scripts/               génération des icônes, patch de traductions, build e2e
```

---

## 🛒 Catalogue

20 produits en 5 catégories : robots (3), accessoires (7), livres (3), packs (3), maison & électroménager (4).

`lib/products.ts` est la **source de vérité canonique** — slug, référence, prix, marque, visuel. Les textes affichés viennent de `lib/product-content.ts`, traduits dans les 4 langues.

> Les références sont dérivées de l'index dans le tableau. **Ajouter un produit en fin de tableau**, jamais au milieu : une insertion renumériserait des références déjà vendues.

---

## 🌐 i18n

Quatre locales, préfixe d'URL toujours présent (`/fr`, `/de`, `/it`, `/en`). La racine `/` négocie la langue depuis `Accept-Language` et retombe sur `/fr`.

Les slugs produit restent dérivés du français et identiques dans toutes les langues : ils servent de clé en base et dans les commandes.

Un test unitaire vérifie que les 4 fichiers de messages exposent exactement les mêmes clés, sans valeur vide, avec les mêmes variables ICU.

---

## 🔍 SEO

| Élément | Mise en œuvre |
|---|---|
| Titres & descriptions | `lib/seo.ts` → `pageMetadata()`, par page et par locale |
| Canoniques | absolues, une par locale |
| hreflang | 4 langues + `x-default`, réciproques, aussi dans le sitemap |
| Données structurées | `Organization`, `WebSite` + `SearchAction`, `Product` + `Offer` + `AggregateRating`, `BreadcrumbList`, `ItemList`, `ContactPage` |
| Open Graph / Twitter | complet, image générée par locale (`opengraph-image.tsx`) |
| Sitemap | 104 URL avec alternates ; panier, favoris et checkout exclus |
| robots.txt | `/api/`, `/admin`, checkout, panier, favoris interdits |
| Sémantique | un seul `h1` par page, `<main>`, sections titrées, lien d'évitement |

`NEXT_PUBLIC_APP_URL` doit pointer vers le domaine public : les canoniques, les hreflang et le JSON-LD sont **figés au build** pour les pages pré-rendues.

---

## ⚡ Performance

- **Icônes** : sprite SVG inline généré depuis `@fortawesome/fontawesome-free` par `scripts/build-icons.mjs`, à la place du CDN Font Awesome (CSS bloquant + ~200 Ko de webfonts). Régénérer avec `npm run build:icons` après avoir ajouté une icône — la CI échoue si le fichier généré diverge du source.
- **Images** : `next/image` en mode `fill` dans des conteneurs au ratio fixé (aucun décalage de mise en page), AVIF/WebP, `priority` sur le seul visuel LCP.
- **Cartes produit rendues côté serveur** : seuls le cœur « favori » et le bouton « ajouter » sont des îlots clients. Le catalogue hydratait auparavant vingt composants complets, ce qui dominait le temps de blocage du thread principal.
- **Filtres de catégorie en liens** (`?cat=`) plutôt qu'en état React : zéro JavaScript pour filtrer, et chaque catégorie devient une adresse explorable par les moteurs. La canonique reste `/catalogue` sans paramètre, ce qui évite les quasi-doublons.
- **Accueil 3D** : perspective, parallaxe au pointeur et halos animés en **CSS pur** — `transform` et `opacity` uniquement, donc composités par le GPU. Aucune bibliothèque 3D n'est chargée. Pas de `filter: blur()` : un flou plein écran re-rastérisé à chaque image coûtait à lui seul plus d'une seconde de calcul de style. L'effet est désactivé sous `prefers-reduced-motion` et aplati sur mobile.
- **Contrastes** : les jetons de couleur ont été assombris au minimum nécessaire pour atteindre le seuil AA (4,5:1 pour le texte, 3:1 pour le reste). Teintes conservées, ratios notés en commentaire dans `app/globals.css`.
- **Préconnexion** au CDN d'images pour retirer un aller-retour DNS + TLS du chemin critique.

---

## 🧪 Tests

```bash
npm run typecheck        # types
npm run lint             # ESLint (next/core-web-vitals)
npm run test:unit        # Vitest — 53 tests
npm run build:e2e        # build de production avec l'URL de test
npm run test:e2e         # Playwright — parcours, SEO, perf, responsive
npm run test:seo         # uniquement les assertions SEO
npm run test:lighthouse  # Lighthouse CI (seuils dans lighthouserc.js)
```

Les tests end-to-end tournent sur le **build de production** (`next start`), seul reflet fidèle du rendu statique, des métadonnées finales et du poids réel des bundles. Ils utilisent le port `3178` (`E2E_PORT` pour en changer).

> `npm run build:e2e` fige `NEXT_PUBLIC_APP_URL` sur l'URL de test. Ne pas enchaîner un `next build` ordinaire après lui : il réécrirait les canoniques avec l'URL du `.env` et ferait échouer les assertions SEO.

### Résultats Lighthouse mesurés

Sur le build de production, preset desktop, machine au repos :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Accueil `/fr` | 97 | **100** | **100** | **100** | 0,8 s | 0 |
| Catalogue | 82 | **100** | **100** | **100** | 1,0 s | 0,001 |
| Fiche produit | 97 | **100** | **100** | **100** | 0,9 s | 0 |

Les seuils de CI sont volontairement asymétriques : accessibilité, bonnes pratiques, SEO et CLS sont **bloquants** (déterministes, tenus à 100) ; le score de performance, le LCP et le TBT sont des **avertissements**, parce qu'ils dépendent de la charge de la machine et de la latence d'Unsplash au premier appel de l'optimiseur d'images — sur un même build, la performance mesurée ici varie de 31 à 97 selon ce qui tourne à côté.

### Visuels distants

```bash
npm run check:images
```

Vérifie que chaque photo Unsplash référencée répond encore. Volontairement hors CI : le résultat dépend d'un service tiers. À lancer avant une mise en production.

---

## 💳 Flux paiement

Quatre processeurs interchangeables (Stripe, Mollie, Adyen, SumUp), sélectionnés depuis `/admin/payment` et stockés en base. Le virement bancaire affiche l'IBAN configuré dans `/admin/bank-accounts`.

Le sous-total est **recalculé côté serveur** depuis la base à chaque commande : le panier du navigateur ne contient que des slugs et des quantités, un panier trafiqué ne peut pas modifier le montant facturé.

---

## 🔐 Admin

`/admin` → `/admin/login` si non connecté. Aucun lien public n'y mène, et l'espace est exclu de `robots.txt`. NextAuth avec un unique fournisseur `Credentials`, sessions JWT de 8 h. Identifiants initialisés par `npm run db:seed` depuis `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

**Changer le mot de passe avant la mise en production.**

---

## 🐳 Docker & déploiement

```bash
docker compose up -d --build
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

`npm run build` (`scripts/build.mjs`) ne synchronise le schéma **que** pour un déploiement de production (`VERCEL_ENV=production`). Ailleurs — preview de pull request, CI, build local — il se contente de générer le client Prisma et de compiler.

> Ce garde-fou répare deux défauts. D'une part, chaque preview poussait le schéma de sa branche dans la base de **production** avec `--accept-data-loss` : une colonne supprimée sur une branche d'essai emportait les données correspondantes, sans revue. D'autre part, tout build dépendait d'une base joignable, si bien qu'une indisponibilité faisait échouer la compilation d'un code pourtant valide.

Pour appliquer un changement de schéma à la main : `npm run db:push`.

Le `Dockerfile` est multi-stage et s'appuie sur `output: 'standalone'`, activé par `BUILD_STANDALONE=true`.

---

## 🧰 Scripts npm

| Script | Action |
|---|---|
| `dev` | serveur de développement |
| `build` | build ; ne touche à la base qu'en déploiement de production |
| `build:e2e` | build de production pour les tests |
| `build:icons` | régénère le sprite d'icônes |
| `start` | serveur de production |
| `lint` · `typecheck` | qualité statique |
| `test` · `test:unit` · `test:e2e` · `test:seo` · `test:perf` · `test:lighthouse` | tests |
| `check:images` | vérifie que les visuels distants répondent |
| `db:push` · `db:seed` · `db:studio` | base de données |

---

© 2026 KitchenPrime.
