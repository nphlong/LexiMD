# Dependencies

Direct dependencies of the LexiMD app. LexiMD is proprietary software. See [LICENSE](../LICENSE). The licenses below allow use in a closed-source app. Versions are what `npm ci` installs from `package-lock.json`.

| Package | Version | License | Role |
| --- | --- | --- | --- |
| expo | 58.0.19 | MIT | Expo SDK |
| expo-asset | 58.0.18 | MIT | Copy the bundled mermaid library onto the phone. Included in Expo Go. |
| expo-file-system | 58.0.11 | MIT | Read and write note files and the local preview page, and open the system document picker. Included in Expo Go. |
| expo-localization | 58.0.5 | MIT | Read the device language so the UI can start in Vietnamese. Included in Expo Go. |
| expo-sharing | 58.0.20 | MIT | Open the system share sheet with a local `.md` file. Saving the file is one of the actions in that sheet. Included in Expo Go. |
| expo-status-bar | 58.0.4 | MIT | Status bar |
| markdown-it | 15.0.3 | MIT | Turn a note into HTML for the preview. Runs in the app, not from a CDN. |
| mermaid | 12.2.0 | MIT | Render diagrams in the preview. `scripts/bundle-preview.mjs` copies `dist/mermaid.min.js` into the app. It is not loaded from a CDN. |
| react | 19.3.0 | MIT | UI |
| react-native | 0.88.0 | MIT | Mobile runtime |
| react-native-safe-area-context | 5.10.1 | MIT | Keep the library and editor inside the screen insets. Included in Expo Go. |
| react-native-webview | 14.0.1 | MIT | Preview page. This is the version Expo SDK 58 bundles, and it is included in Expo Go. |
| @testing-library/react-native | 14.1.0 | MIT | Library and editor tests |
| @types/jest | 30.0.0 | MIT | Jest types |
| @types/react | 19.3.0 | MIT | React types |
| eslint | 9.39.5 | MIT | Lint |
| eslint-config-expo | 58.0.4 | MIT | Expo lint rules |
| jest | 30.5.2 | MIT | Test runner |
| jest-expo | 58.0.12 | MIT | Jest preset for Expo |
| typescript | 6.0.3 | Apache-2.0 | Types |

Ranges in `package.json` are the ones `npx expo install expo@^58.0.0 --fix` selected for SDK 58. `expo` is pinned to `~58.0.19` so a later install stays on SDK 58. The lockfile pins the installed version.

The placeholder icons in `assets/` come from the Expo `blank-typescript` template (MIT, Copyright (c) 2015-present 650 Industries, Inc.). They are not the LexiMD brand. Replace them before a store listing.

Transitive packages were scanned for GPL, AGPL, SSPL, EUPL, and non-commercial licenses. Two matches are outside the preview, and two sit inside the mermaid bundle:

- `node-forge@1.4.0`, dual-licensed BSD-3-Clause OR GPL-2.0. Expo CLI pulls it in. It is not part of the note store or the preview. Use it under BSD-3-Clause.
- `dompurify@3.4.17`, dual-licensed MPL-2.0 OR Apache-2.0. mermaid uses it to sanitize diagram SVG. Use it under Apache-2.0.
- `elkjs@0.9.3` is EPL-2.0. mermaid bundles it for graph layout. EPL-2.0's copyleft covers changes to elkjs itself. This app uses the unmodified library inside the mermaid bundle.
- `khroma@2.1.0` has no `license` field in its package metadata. The license file in the package is MIT.

No added dependency is GPL, AGPL, SSPL, or limited to non-commercial use.
