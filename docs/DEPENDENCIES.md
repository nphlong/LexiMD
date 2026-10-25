# Dependencies

Direct dependencies of the LexiMD app. LexiMD is proprietary software. See [LICENSE](../LICENSE). The licenses below allow use in a closed-source app. Versions are what `npm ci` installs from `package-lock.json`.

| Package | Version | License | Role |
| --- | --- | --- | --- |
| expo | 58.0.19 | MIT | Expo SDK |
| expo-status-bar | 58.0.4 | MIT | Status bar on the hello screen |
| react | 19.3.0 | MIT | UI |
| react-native | 0.88.0 | MIT | Mobile runtime |
| @testing-library/react-native | 14.1.0 | MIT | Hello-screen test |
| @types/jest | 30.0.0 | MIT | Jest types |
| @types/react | 19.3.0 | MIT | React types |
| eslint | 9.39.5 | MIT | Lint |
| eslint-config-expo | 58.0.4 | MIT | Expo lint rules |
| jest | 30.5.2 | MIT | Test runner |
| jest-expo | 58.0.12 | MIT | Jest preset for Expo |
| typescript | 6.0.3 | Apache-2.0 | Types |

Ranges in `package.json` are the ones `npx expo install expo@^58.0.0 --fix` selected for SDK 58. `expo` is pinned to `~58.0.19` so a later install stays on SDK 58. The lockfile pins the installed version.

The placeholder icons in `assets/` come from the Expo `blank-typescript` template (MIT, Copyright (c) 2015-present 650 Industries, Inc.). They are not the LexiMD brand. Replace them before a store listing.

Transitive packages were scanned for GPL, AGPL, SSPL, EUPL, and non-commercial licenses. The only match is `node-forge@1.4.0`, dual-licensed BSD-3-Clause OR GPL-2.0. Expo CLI pulls it in. It is not part of the hello screen. Use it under BSD-3-Clause.
