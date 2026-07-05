# Progression personnelle — Troupe Alpha

Site web de suivi de progression pour la Troupe Alpha (scoutisme).

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Modifier les données

Toutes les données sont dans **`src/data/troupe-alpha.ts`**.

Consultez les commentaires en haut du fichier pour :
- modifier la progression d'un membre
- ajouter des badges complétés ou en cours
- mettre à jour les badges préférés
- éditer les notes

## Déployer sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Importez ce projet (GitHub ou upload)
3. Vercel détecte Next.js automatiquement — cliquez sur **Deploy**

Aucune variable d'environnement requise pour cette version.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react
