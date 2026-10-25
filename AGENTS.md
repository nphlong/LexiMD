# Agent conventions

LexiMD is in planning. The mobile stack, backend, AI provider, and subscription price are open. Read [docs/PLAN.md](docs/PLAN.md) before changing the repo.

## Pull requests

- One milestone from [docs/PLAN.md](docs/PLAN.md) per pull request. Keep the diff small.
- Update the docs in the same pull request when behavior or a decision changes.
- When the owner records a decision, write it into `docs/PLAN.md` and remove the `DECISION NEEDED` mark.
- Leave stack-specific assumptions out of code, docs, and config until that decision is recorded.

## Secrets

- Never commit secrets, keystores, provisioning profiles, API keys, or `.env` files.
- The AI provider key stays on the server.
- Commit a `.env.example` with names only, when a service exists that needs one. Empty values.
- Add stack-specific `.gitignore` entries in the pull request that introduces that stack.

## Product boundaries

- Notes stay on the device. Send note text only when the user taps an AI action.
- The app does not grant itself credits. A rewarded ad is checked with AdMob server-side verification. A later purchase is checked with the store.
- Leave features marked cut or deferred in `docs/PLAN.md` out of the build.
- There is no application project in this repo yet. Scaffold one only after the owner records the stack.
