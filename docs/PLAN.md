# LexiMD plan

Status: M1 is on `dev`. The owner confirmed the hello screen on an iPhone. Opening it on Android is still the owner's check. M2 is split into three pull requests so each one stays reviewable. M2a (create, edit, and delete notes stored on the phone) is in review. M2b (offline split view) and M2c (folders, tags, search, dark mode, English and Vietnamese, and `.md` files) have not started. This is the document to review. The spec is [SPEC.md](SPEC.md). The store steps are [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

The design checklist used here has five questions. A shippable MVP is what is left after all five have a clear answer.

1. Can you say the one thing in one sentence? If you cannot, stop.
2. Is there one action-to-reward cycle under 30 seconds, and can the user repeat it?
3. Does every extra feature serve that loop? If it does not, cut it or defer it.
4. How many screens? The cap is 7. Over 7, trim.
5. What unfinished state brings the user back?

## Decided

Recorded 2026-10-25. Long accepted the recommendations, then confirmed the product changes below on the same date.

1. **Mobile stack.** React Native with Expo. Markdown preview and mermaid still render in a WebView. Signed builds later use Expo's build service (EAS).
2. **Backend and hosting.** We own the AI proxy and the ad-verification endpoint. The AI key stays in that service. The credit ledger is managed Postgres. Hosted auth for Apple, Google, and email is fine. The exact hosting vendor is chosen in M5 and written here when it is chosen. Through v1.1 the service does not keep a note library. v1.3 adds a separate note store for sync.
3. **AI provider and model.** Chosen after a short paid spike, not before. The spike is ten real notes, including Vietnamese notes, each asked for clean markdown and for a mermaid diagram. Keep the provider whose cheap model does both and publishes a token price. Verify the price on that day and store the figure in server config. No provider name, model name, or price is written down before the spike. One provider only in v1.
4. **Credits per action.** 1 credit per action. One rewarded ad grants 5 credits, so one ad covers five actions. Provisional until M7 compares a real ad payout with the cost log. If one ad cannot cover five actions, change this number before M8. Rewarded-ad revenue, including in Vietnam: **verify.** Do not assume an eCPM.
5. **This product.** LexiMD is the product these docs describe. The release pipeline is how this app ships.
6. **Editor.** v1 includes split view and WYSIWYG on one screen, writing the same markdown file. The approach is chosen in a short spike at the start of M4. Two options, and no library is named: a rich-text editor library in React Native, or a WebView-based editor bundled offline next to the preview. Spike the WebView-based editor first, because both modes must round-trip one markdown file, including a mermaid block, and the preview is already a bundled WebView. If that spike fails on the keyboard, selection, or performance, spike a rich-text library next. **Verify** markdown round-trip, mermaid survival, offline use, both keyboards, and a license that fits a closed-source app. Record the license and the result here before the mode is built.
7. **Cloud backup and sync.** In scope as v1.3, after v1.2. v1.2 already adds camera and microphone permissions, and sync changes what the server stores, so it is its own version. Offline-first stays the default. v1 and v1.1 do not sync.
8. **Collaboration.** Paid tier, after sync. A subscriber can share a note or a folder with other people. The design is not decided. The open questions are listed under Later.

## Decisions needed

### Subscription price — DECISION NEEDED before M9

v1 ships with ad credits only, so this can wait.

**Approach, accepted 2026-10-25.** In v1.1, sell one monthly subscription and one credit pack. Set the numbers only after M6 has a measured cost per credit, and after you verify the store commission. Both stores take a cut of in-app purchases. The rate depends on the program you qualify for. **Verify.** No price is proposed in this plan.

## Already decided

- The name is LexiMD. The old working name MarkPeek is retired.
- iOS and Android. Individual Apple and Google developer accounts, so Google's closed-test rule for personal accounts applies. Start that test as early as a real build exists.
- Free tier: local markdown editor with split view and WYSIWYG, live preview including mermaid, dark mode, folders and tags, open/save/share `.md`.
- Through v1.1, notes stay on the device. Note text is sent only when the user taps an AI action. v1.3 adds backup and sync for signed-in users.
- A rewarded video grants 5 credits, verified by AdMob server-side verification. Sign-in (Apple, Google, email) is required for credits and for AI. Local editing works signed out.
- The server holds the AI key and the per-user credit ledger.
- One AI provider and a cheap model at first, a daily cap per user, a global spend ceiling, and cost-per-credit tracking.
- Languages: English and Vietnamese. Test from Vietnam. Minimum age 13.
- Phases are v1, v1.1, v1.2, v1.3, and later, as listed below.

The other 12-week draft assumed a stack, named models, named hosts, a second model for subscribers, RevenueCat, and a public launch campaign. This plan keeps its sequence (accounts, local editor, ledger, AI, ads, closed test, submission) and drops those assumptions. Prices and model names stay out until you verify them.

## 1. Core function

Turn a rough note into clean markdown and see it rendered, diagrams included.

That sentence is specific enough to build. If you want a different sentence, change it before M1. The milestones below all serve this sentence.

## 2. Core loop

The loop stays on the editor and finishes in under 30 seconds.

1. Open a note, or paste rough text into the one that is open.
2. Tap Format, Diagram, or Auto-tag. With no credits, skip the tap and type in either editor mode.
3. The preview updates. That is the reward: clean markdown, a rendered diagram, or tags ready to accept.

Repeat: the note shows the next cue, or you open another note and do the same. The free path (type, watch the preview) needs no account and no network. The credit path needs sign-in and one tap. WYSIWYG and split view are the same screen and the same loop.

Check: one action, one visible reward, same screen, repeatable on the next note. Pass.

## 3. Screens

Cap is 7. v1 has 4. v1.1 has 5. Later phases do not add a screen.

| # | Screen | Purpose | Ships |
| --- | --- | --- | --- |
| 1 | Library | Open an unfinished note, or start one. Folders, tags, and search are on this screen. | v1 |
| 2 | Editor | Write in split view or WYSIWYG, and see the live preview, including mermaid. AI actions are a sheet on this screen. | v1 |
| 3 | Credits | Show the balance, offer one rewarded ad, and sign in when needed. | v1 |
| 4 | Settings | Dark mode, English or Vietnamese, account, privacy, delete account. Sync status is a row here in v1.3. | v1 |
| 5 | Paywall | Buy the subscription or a credit pack, and restore purchases. | v1.1 |

These stay sheets or system pickers, so they do not add a screen: the AI action sheet, the editor-mode switch, folder and tag editing, the ad-consent dialog, the file picker, and the share sheet. Search is a field on the Library.

v1.2 shows related notes as a sheet on the Editor. OCR and voice use the system camera, photo, and microphone pickers.

v1.3 puts backup and sync status on Settings. A sync conflict is a sheet on the note. Collaboration, when it comes, uses a share sheet on the Editor and a marker or filter on the Library. If a later design wants another screen, cut something else first. The cap stays 7.

## 4. Retention hook

A note is unfinished when it has no tags, or Format or Diagram has not been run on it. The Library lists unfinished notes first. Each one carries a single cue: "Clean this up", "Add a diagram", or "Tag this".

That cue is the reason to come back. If the balance is zero, the cue opens Credits, one rewarded ad grants 5 credits, and the same tap is waiting. The cue is the whole hook.

## 5. Features

### v1 — the MVP

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Split-view editor and live preview | The preview is the reward. | Keep |
| WYSIWYG on the same note | You edit the rendered note directly, and the preview is still the reward. Same screen, same file. | Keep. Own milestone so the pull request stays reviewable |
| Mermaid in the preview, bundled for offline | The diagram is the reward you can see. | Keep |
| Dark mode | Keeps you in the editor. It is a setting, not a project. | Keep |
| Folders, manual tags, title and tag search | Gets you back to the note so you can repeat. | Keep |
| Open, save, and share `.md` | Gets text into the loop and out of it. | Keep |
| English and Vietnamese UI | The two languages of the product. | Keep |
| Sign-in: Apple, Google, email | Credits and AI require an account. Editing does not. The same account is reused for sync in v1.3. | Keep |
| Format | The one-tap cleanup. | Keep |
| Diagram (prompt to mermaid) | The one-tap diagram. | Keep |
| Auto-tag, including a suggested folder | Fills the unfinished cue and makes the next visit findable. Weakest of the three actions. It stays because it is the retention hook. | Keep |
| Rewarded video to 5 credits | Refills the loop when the balance is zero. | Keep |
| Proxy, ledger, daily cap, global ceiling, cost log | Makes the credit real and bounds the spend. | Keep |
| Analytics and crash reporting | Part of shipping. Events carry action names only, never note text. No screen. | Keep |

### v1.1 — the first update

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Subscription and one credit pack | A second way to refill the same loop. This is also the purchase step in the release. | Keep, behind the Paywall screen |
| Restore purchases | Required once a purchase exists. | Keep |
| Table, Summary, Action items, Tone | More taps with the same reward: the note gets better. New buttons on the existing AI sheet. | Keep |

### v1.2

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Auto-link | Points at a next note to open. Needs notes already on the device. Sheet on the Editor. | Defer to v1.2 |
| OCR and voice import | Another way to get rough text in, then Format. Adds camera, photo, and microphone permissions and a new privacy pass. | Defer to v1.2 |

### v1.3 — later, after v1.2

Sync is v1.3 rather than v1.2 because v1.2 already adds camera and microphone permissions, and sync changes what the server is allowed to store.

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Cloud backup and cross-device sync | The same note continues on another device, so the loop can resume. Offline-first stays the default. Signed-in only. | Keep for v1.3. Not a v1 feature |

Privacy for that release, also in [SPEC.md](SPEC.md) and [ARCHITECTURE.md](ARCHITECTURE.md):

- Notes of a signed-in user who turns backup on are stored on the server. Until then they are not.
- Encrypt those notes at rest. Who holds the key, and whether a new device can recover them, is verified when v1.3 starts.
- Update the privacy policy, the in-app AI disclosure, the Apple privacy labels, and the Google Data safety form before the release. Say that sync and an AI tap are different uploads.
- Account deletion removes the synced notes.
- Two offline edits of the same note both survive. The user picks which copy to keep.
- No new screen. Status lives in Settings. A conflict is a sheet.

### Later — paid, after sync

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Share a note or a folder with other people | Someone else can continue the note. It depends on the v1.3 note store, and it is a paid feature. | Defer until after v1.3. Design not decided |

Open questions, and the design stops there:

- Permissions: view or edit, a note or a folder, and who may invite.
- Sharing links: who can open one, whether it expires, and whether it works without an account.
- Conflict resolution when two people edit at once, on top of the two-device sync rule.
- Moderation and abuse: unwanted shares, block, and report.
- Privacy: other accounts can read the note, what deletion does to a copy someone else still has, and whether an AI action sends text the other person did not tap.

No new screen is planned. A share sheet on the Editor, and a marker on the Library, have to be enough. If that design needs a sixth product screen, cut something else. The cap is 7, and v1.1 already uses 5.

### Cut

| Feature | Why it is cut |
| --- | --- |
| A second AI provider | One provider is enough until cost per credit is understood. |
| Favorites, word-count dashboard | They do not change the next tap. |
| Onboarding carousel | Another screen. The empty Library can say the one sentence. |
| A web app | iOS and Android are the product. |
| A public launch campaign | Outside this plan. |

## 6. Milestones

Each milestone is about one pull request. Docs are updated in that same pull request. This plan is not M1. M1 is the first code.

The editor work is split. M2 is split view only. M4 is WYSIWYG. M3 sits between them so the closed test starts on the first usable editor, and M4 uploads to that same track.

Start the store accounts now, in parallel with M1. Enrollment and the Play closed test are on the critical path, and both are owner tasks. Steps and the tester bar are in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

### M1 — The app boots on a phone

Stack: React Native with Expo, decided 2026-10-25. The app is Expo SDK 58. M1 started on SDK 57 because, on that day, Expo's create-expo-app docs said Expo Go on a physical phone should use SDK 57 during the SDK 58 transition. The owner's App Store Expo Go is now SDK 58 and cannot open an SDK 57 project, and an older Expo Go cannot be installed on iOS. The app moved to SDK 58 for that reason.

Start with an Expo project in TypeScript. Add lint, tests, and CI that builds on both iOS and Android. The only screen is a hello screen that shows the core-function sentence. No editor, notes, folders, AI, ads, or server in this pull request.

**Done when**

- CI lints, tests, and builds for iOS and Android.
- A debug build installs on one iPhone and one Android phone and shows that hello screen.

**Status:** CI lints, tests, and compiles an Android debug APK and an iOS Simulator app. The owner confirmed the hello screen on an iPhone. Android is still the owner's check. CI does not install the app on a phone, and it does not sign a store build.

**Release step covered:** the toolchain, and installing a build while in Vietnam.

**You do:** Install a supported Node.js (22.13 or newer on the 22 line, 24.3 or newer, or 26 and later; not 23 or 25). Open the app on one iPhone and one Android phone and confirm the hello screen shows the core-function sentence. The current Expo Go is enough. A free Expo account is required for Expo Go on a physical iPhone. A local debug build needs Android Studio with Android SDK Platform 37, and a Mac with Xcode 26.4 or newer for the iPhone. Steps are in the README. A paid Apple or Google developer account is not required for this check. Start those enrollments in parallel anyway; they are on the critical path for M3.

### M2 — Split view works offline

**Done when**

- You can create, edit, and delete a note.
- Split view renders markdown and a mermaid diagram with the network off.
- You can put the note in a folder, add tags, and find it by title or tag.
- Dark mode works. The UI switches between English and Vietnamese.
- You can open, save, and share a `.md` file.
- The AI tap arrives in M6. Here the free path is enough: type or paste markdown and see the preview, in under 30 seconds.
- WYSIWYG is not in this pull request.

**Release step covered:** the product loop on a device, before any account exists.

**Status:** One pull request that also bundled a markdown renderer, mermaid, folders, tags, search, dark mode, two languages, and file sharing would be too large to review. M2 is three sequential pull requests, each against `dev`. The next one starts only after the previous one is reviewed.

| Pull request | What it adds |
| --- | --- |
| M2a | Create, edit, and delete a note. Each note is a markdown file in the app documents directory, with `index.json` beside those files. The library lists notes. An empty library shows the core-function sentence. |
| M2b | Split view. The preview is a WebView that renders markdown and mermaid from libraries bundled in the app. |
| M2c | Folders, tags, search by title or tag, dark mode, English and Vietnamese, and open, save, and share a `.md` file. |

M2a is the current pull request. The free path that shows a preview in under 30 seconds is M2b.

**You do:** use it yourself. If the loop is slower than 30 seconds or the preview is wrong, say so in the pull request. That blocks M3.

### M3 — First signed builds, and the Play clock starts

**Done when**

- An internal TestFlight build and a Play closed-testing build of the M2 app install on your phones.
- Signing is documented. The keystores are in a password manager, not in git.
- A secret scan of the binaries is clean.
- The privacy-policy URL is live in English and Vietnamese, covering local notes. AI, ads, and sync paragraphs are updated in the milestones that add them.

**Release step covered:** certificates, bundle ids, TestFlight, and the Play closed track. This is the earliest real build, so the closed-test clock starts here.

**You do:** finish individual Apple and Google enrollments if they are still open. Create the app records. Invite testers and tell them to stay opted in. **Verify** the current tester count and duration on Google's help page, and recruit above that count. Confirm the closed-test clock has started.

### M4 — WYSIWYG on the same note

v1 includes WYSIWYG beside split view, decided 2026-10-25. This is its own pull request so M2 stays reviewable. Upload the build to the TestFlight and Play closed tracks opened in M3.

Run the spike from Decided item 6 first. Record the choice, what you verified, and the dependency license in this plan before building the mode.

**Done when**

- The spike result is written in this plan.
- The Editor screen switches between split view and WYSIWYG on the same note. No new screen.
- An edit in either mode saves the same `.md` file, and the preview still matches, with the network off.
- A mermaid block is preserved. **Verify** how the chosen editor displays it.
- The loop in either mode still finishes in under 30 seconds.

**Release step covered:** the editing surface that ships in v1, added to the closed test that is already running.

**You do:** Confirm the spike choice before the mode is built. Use both modes on one note. If WYSIWYG makes the loop too slow, say so. That blocks M5.

### M5 — Sign-in and the ledger

The proxy, the ad-verification endpoint, and managed Postgres are decided. Choose the hosting vendor in this milestone and record it under Decided.

**Done when**

- Apple, Google, and email sign-in work.
- A signed-in user has a ledger row. Recommended starting balance: 0, so the later ad path is real. Say if you want a small starter grant instead.
- Signed-out editing still works, and notes are still only on the device.
- Delete account removes the server user, the ledger, and any in-flight request text.
- The AI key is not in the app. The server does not have a note library.

**Release step covered:** a deployed server, auth consoles, Sign in with Apple, and keeping secrets on the server.

**You do:** pick the hosting vendor and write it into the Decided section. Create the auth credentials in the Apple and Google consoles. Keep every secret out of the repo and out of chat. Confirm the starting balance.

### M6 — Three AI actions

Run the provider spike from the Decided section, then name the provider and the cheap model here. Each action spends 1 credit.

**Done when**

- Format, Diagram, and Auto-tag each run through the proxy, spend 1 credit, and write the result into the local note. The result is visible in both editor modes.
- Opening or saving a note sends nothing. The first AI tap shows the disclosure and can be cancelled.
- A per-user daily cap and a global spend ceiling both stop the next call.
- Each call logs token counts and an estimated cost from a price you verified that day.
- A provider failure does not debit. A retry with the same request id does not debit twice.
- Request text is deleted within 24 hours.
- One Vietnamese note and one mermaid prompt succeed on the cheap model.

**Release step covered:** a server-side provider key, and cost-per-credit measurement.

**You do:** run the spike, then write the provider and model into the Decided section. Verify the token price that day. Set a monthly spend alert on the provider dashboard. Set the two caps. Read one real cost log and confirm the numbers. Check whether the provider retains prompts or trains on them.

### M7 — A rewarded ad grants 5 credits

**Done when**

- The ad is opt-in from the Credits screen.
- Completing a test ad grants exactly 5 credits, once.
- A replayed callback or a bad signature grants nothing.
- The balance on screen matches the ledger. The app does not increment the balance itself.
- The EU/UK consent form is integrated. **Verify** which regions must see it, and what a Vietnam test device sees.
- After the ad, the unfinished-note cue still leads back to the same tap.

**Release step covered:** an AdMob app, a rewarded unit, and server-side verification.

**You do:** create the AdMob app and the verification keys. Watch one test ad end to end. Compare the cost log from M6 with what one test reward represents. If one ad cannot cover five actions, change the 1-credit rule before M8.

### M8 — v1 submitted, staged rollout started

**Done when**

- Split view and WYSIWYG are both in the build you submit.
- Privacy policy and terms are live in English and Vietnamese, including the AI and ads facts from [SPEC.md](SPEC.md). Notes are still described as on-device. Sync is not in this release.
- Apple privacy labels and the Google Data safety form are submitted. **Verify** each question against the SDKs in the binary.
- Crash reporting and the small analytics set are on, with no note contents. You have caused one test crash and seen it.
- In-app account deletion is on the build you submit.
- A reviewer account with credits is in the review notes. The local editor works without it.
- Both stores are in review, then in a staged rollout at the smallest step the console offers. **Verify** the control.
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) is filled in for this version.
- Play production access has been applied for, which requires the closed test from M3 to have met the live tester bar. **Verify.**

**Release step covered:** store review and a staged rollout.

**You do:** listing copy, screenshots, support URL, age and content questionnaires. Answer a rejection without adding scope. Agree before the rollout widens. Minimum age 13 is our rule; if a questionnaire comes out stricter, follow the questionnaire.

### M9 — v1.1 update through the same path

Needs the subscription price from Decisions needed.

**Done when**

- One subscription and one credit pack sell in the sandbox on both platforms.
- Restore purchases works.
- Table, Summary, Action items, and Tone are buttons on the existing AI sheet.
- The server grants those credits only after a verified purchase.
- The update goes through TestFlight, the Play test track, and then a staged production rollout.
- The release checklist is filled in again, for this version.

**Release step covered:** an update, in-app purchase review, and a second pass through the release checklist.

**You do:** set the price after reading the M6 cost and the current store commission (**verify**). Create the products in both consoles. Buy one and restore it in sandbox. Agree the rollout.

v1.2 (auto-link, OCR, voice) starts only after M9 is live. It is a new permission and privacy pass. v1.3 (backup and sync) starts after v1.2. Collaboration starts after v1.3, for subscribers, and only once the open questions above have answers. None of those are part of M1 through M9.

## 7. Accounts, legal, and store

Owner tasks. Detail and the Play tester bar are in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). **Verify** every fee and every form on the day you submit it.

- [ ] Apple Developer Program, individual. Fee published by Apple as 99 USD per year, in local currency where offered. **Verify** at enrollment.
- [ ] Google Play Console, individual. Registration fee: **verify.**
- [ ] Play closed test started at M3. Google's published rule, read on 2026-10-25, applies to personal accounts created after 13 November 2023: at least 12 testers opted in continuously for 14 days, then an application for production access. **Verify** on [Google's help page](https://support.google.com/googleplay/android-developer/answer/14151465). If the account is older, verify whether production is already unlocked, and still run the closed test.
- [ ] AdMob account and server-side verification.
- [ ] Privacy policy URL, English and Vietnamese. v1 says notes stay on the device. v1.3 updates that before sync ships.
- [ ] Terms of service. Subscription terms get added before M9: price, period, auto-renew, how to cancel.
- [ ] In-app disclosure before the first AI action. A separate disclosure before the first sync, in v1.3.
- [ ] Apple privacy labels and Google Data safety form. Update both again before v1.3.
- [ ] In-app account deletion, including server data. From v1.3, that includes synced notes.
- [ ] EU/UK ad consent.
- [ ] Restore purchases on the v1.1 paywall.
- [ ] AI provider named in the policy, with retention and training terms checked. **Verify.**
- [ ] Store age and content questionnaires. Our minimum age is 13. **Verify** the questionnaire result.
- [ ] Sign in with Apple beside Google sign-in. **Verify** the current rule.
- [ ] Reviewer test account with credits.
- [ ] v1.3: encryption at rest, who holds the key, and a recovery path for a second device. **Verify** before building sync.

## 8. Risks

| Risk | What we do |
| --- | --- |
| One rewarded ad pays less than five AI actions, especially with Vietnam traffic. | Measure in M6 and M7. Change the credit cost or the cap. Ad revenue: **verify.** |
| Play production stays locked until the personal-account closed test passes. | Start the closed test at M3. Recruit extra testers. The published bar on 2026-10-25 was 12 testers for 14 continuous days, for accounts created after 13 November 2023. **Verify.** |
| The preview WebView is slow, or review treats the app as a thin wrapper. | Native shell, WebView for preview only, libraries bundled offline. Test on a low-end Android phone. Apple's minimum-functionality rule: **verify.** |
| WYSIWYG on React Native is hard. | Two options: a rich-text editor library, or a WebView-based editor. Spike the WebView editor first, then a rich-text library if that fails. **Verify** markdown round-trip, mermaid, offline use, both keyboards, and the license. Record the license. If both the editor and the preview are WebViews, the native shell still has to carry the library, folders, credits, and settings. |
| The cheap model mishandles Vietnamese or mermaid. | The M6 spike uses both. Switch model before the three actions ship if it fails. |
| A modified client grants itself credits. | Only a verified ad callback, or a later verified purchase, adds credits. M7 includes a replayed-callback test. |
| Note text leaks into logs, analytics, or a stored library before sync exists. | AI request text lives for the retry window only. Sample one analytics event and one crash before M8 submission. v1.3 is the first release allowed to store notes, and only in the note store. |
| The single provider raises prices or goes down. | Daily caps and a dashboard spend alert. Price: **verify** when it changes. |
| Apple, Play, or AdMob enrollment takes longer than expected. | Start accounts before M1 is done. **Verify** current review times. Do not plan on same-day enrollment. |
| Review rejects the AI disclosure, account deletion, or ads. | Those items are M8 acceptance criteria. |
| Sync ships with a privacy story that still says notes never leave the device. | v1.3 updates the policy, the in-app disclosure, and both store forms before release. Account deletion removes synced notes. |
| OCR, voice, sync, or collaboration land in a v1 pull request. | They have their own later versions. WYSIWYG is the v1 exception, and it is M4 only. |
| Signing keys are lost. | Password manager from M3. Play App Signing recovery steps: **verify** when you enroll. |

## Done

v1 is live on both stores with split view and WYSIWYG, v1.1 has shipped through this checklist, and a sandbox purchase restores. v1.2, v1.3, and paid collaboration follow that, in that order.
