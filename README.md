# Ben Damti Portfolio

Static Vite + React + TypeScript portfolio site based on the original `portfolio-demo-v10-fullscreen copy.html` mockup. The HTML file is kept unchanged as the visual/behavioral backup source.

## Install

```bash
npm install
```

## Local Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## GitHub + Vercel Deployment

1. Create a GitHub repository.
2. Commit this folder, including `src`, `public`, config files, and `package-lock.json`.
3. Push to GitHub.
4. In Vercel, choose **Add New Project** and import the GitHub repository.
5. Keep Vercel's defaults for Vite:
   - Build command: `npm run build`
   - Output directory: `dist`
6. Deploy.

## Editing Content

- Social links and email: `src/data/siteContent.ts`
- About text, skills, languages, technologies, and work areas: `src/data/siteContent.ts`
- Project titles, descriptions, links, and future asset paths: `src/data/siteContent.ts`

## Adding Project Assets Later

Place future project images in `assets/`, import them in `src/data/siteContent.ts`, then assign each imported image to the project's `assetPath`. The current placeholder visuals are intentional and preserve the mockup direction until real assets are added.
