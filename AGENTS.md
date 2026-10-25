# Agent conventions

LexiMD is in planning. The mobile stack is React Native with Expo, in TypeScript, decided 2026-10-25. The hosting vendor and the AI provider are still open. The subscription price stays open until v1.1. Read [docs/PLAN.md](docs/PLAN.md) before changing the repo.

## Pull requests

- One milestone from [docs/PLAN.md](docs/PLAN.md) per pull request. Keep the diff small.
- Update the docs in the same pull request when behavior or a decision changes.
- When the owner records a decision, write it into `docs/PLAN.md` and remove the `DECISION NEEDED` mark.
- M1 is an Expo project with TypeScript, lint, tests, and CI that builds on iOS and Android, and a hello screen. Add no product features in that pull request.
- Add Expo and Node `.gitignore` entries in the M1 pull request.

## Secrets

- Never commit secrets, keystores, provisioning profiles, API keys, or `.env` files.
- The AI provider key stays on the server.
- Commit a `.env.example` with names only, when a service exists that needs one. Empty values.

## Product boundaries

- Notes stay on the device. Send note text only when the user taps an AI action.
- The app does not grant itself credits. A rewarded ad is checked with AdMob server-side verification. A later purchase is checked with the store.
- Leave features marked cut or deferred in `docs/PLAN.md` out of the build.
- There is no application project in this repo yet. The first code is M1, as written in `docs/PLAN.md`.
- Do not add third-party code under a license incompatible with a closed-source mobile app. Record the license of each dependency we add.
