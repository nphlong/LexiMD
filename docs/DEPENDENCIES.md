# Dependencies

Direct dependencies of the LexiMD app, recorded in M1. LexiMD is proprietary software. See [LICENSE](../LICENSE). The licenses below allow use in a closed-source app. Versions are what `npm ci` installs from `package-lock.json`.

| Package | Version | License | Role |
| --- | --- | --- | --- |
| expo | 57.0.31 | MIT | Expo SDK |
| expo-status-bar | 57.0.1 | MIT | Status bar on the hello screen |
| react | 19.2.3 | MIT | UI |
| react-native | 0.86.3 | MIT | Mobile runtime |
| @testing-library/react-native | 14.1.0 | MIT | Hello-screen test |
| @types/jest | 29.5.14 | MIT | Jest types |
| @types/react | 19.2.18 | MIT | React types |
| eslint | 9.39.5 | MIT | Lint |
| eslint-config-expo | 57.0.2 | MIT | Expo lint rules |
| jest | 29.7.0 | MIT | Test runner |
| jest-expo | 57.0.6 | MIT | Jest preset for Expo |
| typescript | 6.0.3 | Apache-2.0 | Types |

Ranges in `package.json` are the ones `npx expo install` selected for SDK 57. The lockfile pins the installed version.

The placeholder icons in `assets/` come from the Expo `blank-typescript` template (MIT, Copyright (c) 2015-present 650 Industries, Inc.). They are not the LexiMD brand. Replace them before a store listing.

Transitive packages were scanned for GPL, AGPL, SSPL, EUPL, and non-commercial licenses. The only match is `node-forge@1.4.0`, dual-licensed BSD-3-Clause OR GPL-2.0. Expo CLI pulls it in. It is not part of the hello screen. Use it under BSD-3-Clause.
