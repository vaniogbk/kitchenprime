# KitchenPrime

E-commerce SaaS multilingue (FR · DE · IT · EN) pour la vente du **Thermomix TM7** et de ses accessoires en Europe.

Stack : **Next.js 14 (App Router) · Prisma + MySQL · NextAuth · next-intl · Tailwind CSS · Mollie · Wise · WhatsApp Cloud API · Nodemailer / SendGrid · pdfkit**. Déploiement cible : **Docker + GitHub Actions + Nginx sur Hostinger**.

Le design correspond strictement au template canonique `kitchenprime_v3_clean.html` — Direction D "Indigo & Cuivre". Toute régénération de composant doit conserver cette identité : boutons en couleur pleine (jamais transparents), navbar minimale (Accueil · Catalogue · search · cart), pas de section "Offre de lancement", socials Facebook · Instagram · TikTok uniquement.

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Copier l'environnement
cp .env.example .env
# Éditer .env : DATABASE_URL, NEXTAUTH_SECRET, MOLLIE_API_KEY, SMTP_*

# 3. Préparer la base
npm run db:push   # crée le schéma
npm run db:seed   # 20 produits + utilisateur admin

# 4. Lancer en dev
npm run dev
# → http://localhost:3000 (redirige vers /fr)
```

> ⚠️ **Note historique** : `nodemailer` est fixé à `^7.0.7` (et non `^6.9.x`) pour satisfaire la peer-dep de `next-auth@4.24.14`. C'est cette correction qui a débloqué l'installation lors de la session précédente.

---

## 🗂️ Arborescence

```
app/
  [locale]/            # pages publiques i18n (fr|de|it|en)
    page.tsx           # Accueil — Hero + TrustStrip + Populaires + Testimonials
    catalogue/         # Catalogue 20 produits + filtres
    produit/[slug]/    # Fiche produit (PDP)
    checkout/          # Tunnel de commande
  admin/               # Espace admin (non listé, URL séparée)
    login/
    dashboard/
    orders/
    products/
  api/
    auth/[...nextauth]/
    products/          # GET catalogue public
    orders/            # POST création commande → Mollie ou Wise
    orders/[id]/receipt/  # GET PDF de facture
    webhooks/mollie/   # Mollie webhook (paid → email + PDF)
    webhooks/wise/     # Stub réconciliation manuelle
    whatsapp/          # Cloud API send (ops)
    admin/products/    # PATCH catalogue (auth)
    admin/orders/      # GET/PATCH commandes (auth)
  globals.css          # Tokens Direction D + classes utilitaires
  robots.ts, sitemap.ts
components/
  layout/  TopBar · Header · Footer · WhatsAppFloat (draggable)
  shop/    Hero · TrustStrip · ProductCard · CatalogGrid · PDPGallery · PDPActions · CheckoutForm · Testimonials
lib/
  prisma.ts · products.ts (catalogue) · whatsapp.ts · auth.ts ·
  mollie.ts · email.ts · pdf.ts · i18n.ts · cn.ts
messages/  fr.json · de.json · it.json · en.json
prisma/    schema.prisma · seed.ts
public/    favicon.svg · icon.svg
```

---

## 🎨 Design — Direction D : Indigo & Cuivre

Tokens verrouillés dans `app/globals.css` et `tailwind.config.ts` :

| Rôle | Hex |
|---|---|
| Indigo principal | `#3D4DB8` |
| Indigo foncé | `#1A1F5E` |
| Indigo profond | `#2E3E9E` |
| Cuivre | `#B8622A` |
| Cuivre foncé | `#9E4E1E` |
| WhatsApp | `#25D366` |
| Encre (texte) | `#1A1F5E` |
| Fond | `#F7F8FD` |
| Or (accents) | `#FFD88A` |

Typo : **Outfit** (display, 400–900) + **Plus Jakarta Sans** (UI, 400–700), chargées via `next/font/google`. Icônes : **Font Awesome 6.5.1** via CDN.

---

## 🛒 Catalogue (20 produits)

Trois robots (TM7 / TM6 / Cookidoo), dix accessoires, quatre livres et trois packs. Source de vérité : `lib/products.ts` (importé par le seed Prisma). Réfs auto-générées par catégorie : `ROB-001`, `ACC-001`, `LIV-001`, `PCK-001`…

---

## 💳 Flux paiement

- **Carte** → création d'une commande locale (`status: pending`), puis création d'un paiement Mollie. La page checkout redirige vers l'URL `_links.checkout.href` retournée par Mollie. Webhook `/api/webhooks/mollie` met à jour le statut, génère la facture PDF (`pdfkit`) et l'envoie par email.
- **Wise** → commande créée avec `paymentMethod: wise`, email d'instructions envoyé au client. Réconciliation manuelle pour l'instant via `/admin/orders`.
- **WhatsApp** → tous les CTAs ouvrent `https://wa.me/33780967339?text=…` avec le nom du produit pré-rempli (numéro configurable via `NEXT_PUBLIC_WA_NUMBER`).

Le sous-total est **recalculé côté serveur** depuis la DB (jamais depuis le client) pour empêcher la falsification des prix.

---

## 🌐 i18n

Quatre locales, préfixe d'URL toujours présent (`/fr`, `/de`, `/it`, `/en`). `next-intl` charge `messages/{locale}.json`. Le sélecteur de la TopBar bascule en conservant le chemin courant.

---

## 🔐 Admin (espace privé)

URL : `/admin` → redirige vers `/admin/login` si non connecté, sinon `/admin/dashboard`. Aucun lien public ne pointe vers l'admin. NextAuth avec un seul fournisseur (`Credentials`), sessions JWT de 8h.

Comptes par défaut : `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `.env` — créés/synchronisés par `npm run db:seed`. **Changer le mot de passe avant la mise en prod.**

---

## 🐳 Docker (local & Hostinger)

```bash
# Build + run avec MySQL
docker compose up -d --build

# Push du schéma
docker compose exec app npx prisma db push

# Seed
docker compose exec app npm run db:seed
```

Le `Dockerfile` est multi-stage (deps → builder → runner) et utilise `output: 'standalone'` de Next.js, ce qui réduit l'image runtime à ~150 Mo.

---

## ☁️ Déploiement Hostinger

1. Sur le VPS Hostinger, installer Docker, Docker Compose et Nginx.
2. Copier `nginx.conf` vers `/etc/nginx/sites-available/kitchenprime`, créer le symlink, puis `nginx -t && systemctl reload nginx`.
3. Émettre le certificat SSL Let's Encrypt (`certbot --nginx -d kitchenprime.com -d www.kitchenprime.com`) et décommenter le bloc `443` de `nginx.conf`.
4. Créer un dossier de déploiement (`/var/www/kitchenprime`) et y placer `.env`.
5. Configurer les secrets GitHub : `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`, plus `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`.
6. Push sur `main` → GitHub Actions rsync + `docker compose build && up`.

---

## 🧰 Scripts npm

| Script | Action |
|---|---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | `prisma generate` + build Next.js |
| `npm start` | Serveur prod (après `build`) |
| `npm run db:push` | Push du schéma Prisma sur la DB |
| `npm run db:seed` | Seed produits + admin |
| `npm run db:studio` | Prisma Studio (explorateur de DB) |
| `npm run lint` | Next.js lint |

---

## 📎 Référence design

Le fichier `kitchenprime_v3_clean.html` (fourni séparément) est la source canonique. Tout ce qui s'éloigne de ce template doit être réaligné — pas l'inverse.

© 2026 Vanio.dev pour KitchenPrime SAS.
