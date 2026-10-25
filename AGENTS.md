# Agent conventions

The mobile stack is React Native with Expo SDK 58, in TypeScript. The stack was decided 2026-10-25. The SDK moved from 57 to 58 so the current App Store Expo Go can open the app. The app lives at the repository root. The hosting vendor and the AI provider are still open. The subscription price stays open until v1.1. Read [docs/PLAN.md](docs/PLAN.md) before changing the repo.

## Pull requests

- One milestone from [docs/PLAN.md](docs/PLAN.md) per pull request. Keep the diff small.
- Update the docs in the same pull request when behavior or a decision changes.
- When the owner records a decision, write it into `docs/PLAN.md` and remove the `DECISION NEEDED` mark.
- M1 is the Expo project at the repo root: TypeScript, lint, tests, CI that builds on iOS and Android, and a hello screen. Add no product features to that screen.
- Expo and Node `.gitignore` entries were added in M1. Keep generated `ios/` and `android/` directories out of git.
- WYSIWYG is part of v1, in its own milestone after the split-view editor. Do not add it to the M1 hello screen.
- M2 is split into three pull requests against `dev`. M2a stores notes on the phone (create, edit, delete). M2b is the offline split-view preview. M2c adds folders, tags, search, dark mode, and open, save, and share `.md`. The v1 UI is English. User-facing strings live in `src/copy.ts`. Do not add a language pack, a localization library, WYSIWYG, AI, ads, accounts, a backend, sync, or analytics to M2. `npm ci` runs `scripts/bundle-preview.mjs`, which copies mermaid into `assets/preview/` for the offline preview. That copy is generated. Do not commit it.

## Secrets

- Never commit secrets, keystores, provisioning profiles, API keys, or `.env` files.
- The AI provider key stays on the server.
- Commit a `.env.example` with names only, when a service exists that needs one. Empty values.

## Product boundaries

- Through v1.1, notes stay on the device. Send note text only when the user taps an AI action. Cloud backup and sync are v1.3, as written in `docs/PLAN.md`. Do not build them earlier.
- The app does not grant itself credits. A rewarded ad is checked with AdMob server-side verification. A later purchase is checked with the store.
- Leave features marked cut or deferred in `docs/PLAN.md` out of the build. Collaboration is a later paid feature. Do not design or build it before sync.
- The phone app is the Expo project at the repo root, started in M1. Do not create a second app. Later milestones build on this one.
- Do not add third-party code under a license incompatible with a closed-source mobile app. Record the license of each dependency we add.
