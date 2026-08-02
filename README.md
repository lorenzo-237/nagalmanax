# Nagalmanax

Calendrier mensuel de l'Almanax Dofus : ressource et bonus du jour, avec
gestion du nombre de personnages, marquage des jours préparés et copie
rapide du nom de la ressource.

Données fournies par l'API publique [dofusdude/almanax-api](https://github.com/dofusdude/almanax-api).

## Stack

- [Next.js](https://nextjs.org) (App Router, export statique) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (base-ui)

## Développement

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

Autres commandes utiles :

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run format     # Prettier
```

## Build & export statique

```bash
npm run build
```

Génère un site 100% statique dans `out/` (`output: "export"` dans
`next.config.ts`). Le dossier ne peut pas être ouvert directement en
double-cliquant sur `index.html` (chemins d'assets absolus) : servez-le
avec un petit serveur local, par ex. `npx serve out`.

## Déploiement (GitHub Pages)

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
build et déploie automatiquement sur GitHub Pages à chaque push sur
`main` (à activer une fois dans Settings → Pages → Source →
**GitHub Actions**).

> Si le site est servi sous un sous-chemin (`<user>.github.io/<repo>/`),
> pensez à configurer `basePath`/`assetPrefix` dans `next.config.ts`,
> sinon les assets `_next/...` pointeront à la racine du domaine.

## Structure

- `lib/api.ts` — client de l'API Almanax
- `lib/calendar.ts` — helpers de grille de calendrier
- `hooks/` — `use-almanax-month`, `use-local-storage`
- `components/almanax/` — composants du calendrier (thème sombre dédié)
