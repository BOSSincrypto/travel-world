# Travel World

Travel World is an interactive world-travel tracker: mark countries visited, keep a personal progress score, and save trip memories and photos.

## Requirements

- Node.js 24 LTS or newer
- npm 10 or newer

## Start locally

```bash
npm ci
npm run dev
```

Vite prints the local URL in the terminal. Use `npm run dev -- --host` when you need to open the app from another device on the same network.

## Validate a change

```bash
npm run typecheck
npm run build
npm run preview
```

The same typecheck and production build run on every push and pull request through GitHub Actions. The generated `dist/` directory is uploaded as a short-lived CI artifact.

## Releases

Releases are automated with [Release Please](https://github.com/googleapis/release-please-action). Use [Conventional Commits](https://www.conventionalcommits.org/) such as `feat: add country notes` or `fix: preserve map filters` on `main`:

1. Release Please opens or updates a release pull request.
2. Merging that pull request updates the package version and changelog and creates a tagged GitHub Release.

The workflows pin third-party actions to immutable commit SHAs. Dependabot checks npm and GitHub Actions dependencies weekly.

## GitHub Pages

The `main` branch is published by `.github/workflows/pages.yml`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** once; subsequent pushes deploy the production bundle automatically.
