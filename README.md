# LexiMD

LexiMD is an AI-assisted markdown notes app for iOS and Android. You turn a rough note into clean markdown and see it rendered, diagrams included.

It ships on the App Store and Google Play. That path includes signed builds, closed testing, rewarded ads, subscriptions, accounts, store review, a staged rollout, and updates.

**Status: M1, the hello screen.** The app is React Native with Expo SDK 58. This repository holds that app, the spec, the plan, and the release checklist. There is no editor yet.

## Run the app

Install Node.js 22.13 or newer on the 22 line, 24.3 or newer on the 24 line, or Node.js 26 and later. Odd-numbered releases such as 23 and 25 are not supported. This repo pins 22.23.4 in `.nvmrc`, which is on the supported 22 line. Then, from the repository root:

```sh
npm ci
npm start
```

The only screen shows **LexiMD** and this sentence: "Turn a rough note into clean markdown and see it rendered, diagrams included."

The iOS bundle id and the Android application id are both `app.leximd`. They exist so a debug build can compile. They are not registered in App Store Connect or Play Console. Change them before M3 if you want a different id.

### On an iPhone, with Expo Go

1. Install the current Expo Go from the App Store. That copy is SDK 58 and will not open an SDK 57 project. This app is SDK 58 so that Expo Go can open it.
2. Run `npx expo login` and sign in to Expo Go with the same account. A free Expo account is enough. Expo Go on a physical iPhone opens the project only when those two accounts match.
3. Run `npm start` and scan the QR code. The phone and the computer should be on the same Wi-Fi.
4. If the phone cannot reach the computer, run `npx expo start --tunnel` and scan again. The first tunnel start may install `@expo/ngrok`. Tunnel is the fallback for a separate network, including a phone on cellular data.

### On an Android phone, with Expo Go

1. Install the current Expo Go from the Play Store and update it if the installed copy is older than SDK 58. An SDK 57 Expo Go will not open this project.
2. Run `npm start` and scan the QR code from the same Wi-Fi, or use `npx expo start --tunnel` when the phone cannot reach the computer.

### Debug build on a phone

This is a local compile. It does not need a paid Apple Developer Program or Google Play Console account.

**Android.** Install JDK 17 and Android Studio. In the SDK manager, install Android SDK Platform 37 and Build-Tools 37.0.0. SDK 58 compiles against API 37. On the phone, enable Developer options (tap Build number seven times) and turn on USB debugging. Plug the phone in and run:

```sh
npx expo run:android
```

That generates `android/`, builds a debug APK with the automatic debug keystore, and installs it. CI also uploads that kind of APK (arm64-v8a only) on the workflow run. Sideloading the artifact is optional. The check above is still the one to do.

**iPhone.** Use a Mac with Xcode 26.4 or newer. That is still Expo SDK 58's documented minimum (SDK reference read 2026-10-25). The iOS app does not compile on Linux or Windows. Turn on Developer Mode, connect the phone, and run:

```sh
npx expo run:ios --device
```

Xcode asks for an Apple ID to sign the debug install. A free Apple ID is enough for your own phone. The paid program is what M3 needs for TestFlight.

`ios/` and `android/` are generated. They are not committed.

### Lint and tests

```sh
npm run lint
npm test
npm run typecheck
```

## How to read the docs

Start with the plan. It is the document to review.

| Doc | What it is |
| --- | --- |
| [docs/PLAN.md](docs/PLAN.md) | Decisions, the core loop, screens, features by version, milestones, store checklist, risks. |
| [docs/SPEC.md](docs/SPEC.md) | Product spec. Replaces the MarkPeek v0.2 draft. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Components, the data flow for an AI action and for a rewarded ad, and how sync fits later. |
| [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) | End-to-end release checklist for each LexiMD release. |
| [AGENTS.md](AGENTS.md) | Conventions for coding agents in this repo. |
| [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md) | License of each direct dependency. |

Owner: Long.

## License

LexiMD is proprietary software. See [LICENSE](LICENSE).
