# LexiMD plan

Status: planning. This is the document to review. The spec is [SPEC.md](SPEC.md). The store steps are [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

The design checklist used here has five questions. A shippable MVP is what is left after all five have a clear answer.

1. Can you say the one thing in one sentence? If you cannot, stop.
2. Is there one action-to-reward cycle under 30 seconds, and can the user repeat it?
3. Does every extra feature serve that loop? If it does not, cut it or defer it.
4. How many screens? The cap is 7. Over 7, trim.
5. What unfinished state brings the user back?

## Decisions needed

Write the choice under the item. Code milestones wait on the decision they name.

### 1. Mobile stack — DECISION NEEDED

Blocks milestone M1.

**Flutter.** One codebase and a strong mobile UI. Markdown preview and mermaid are JavaScript libraries, so the preview renders in a WebView. The editor text can be a native field.

**React Native with Expo.** One codebase. Those same libraries still render in a WebView. Expo's build service (EAS) produces the signed iOS and Android builds this rehearsal exists to practise.

**Recommendation:** React Native with Expo. The preview is a WebView either way, and the build service matches the release rehearsal. Flutter is a sound choice if you would rather write Dart. This repo assumes neither until the choice is written here.

### 2. Backend and hosting — DECISION NEEDED

Blocks milestone M4.

**A small service you own, plus managed Postgres.** The service is the AI proxy and the ad-verification endpoint. Postgres holds the ledger. A hosted auth product covers Apple, Google, and email. The service language can follow the stack decision.

**An all-in-one platform.** Auth, database, and functions from one vendor.

**Recommendation:** own the proxy and the ad webhook as a small service, with managed Postgres for the ledger. Hosted auth is fine. Keep the AI key in the service environment. A database function the phone can call is the wrong place for that key. Pick the vendor together with the stack. The service does not keep a note library.

### 3. AI provider and model — DECISION NEEDED

Blocks milestone M5. Pricing: **verify** on the provider's site the day you choose. This plan names no model and no price.

**Options:** one chat API from a major provider, on a cheap model. A second provider is out of v1.

**Recommendation:** decide with a short paid spike, ten real notes, including Vietnamese notes, each asked for clean markdown and for a mermaid diagram. Keep the provider whose cheap model does both and publishes a token price. Re-check that price whenever it changes. Store the figure you verified in server config, not in the app.

### 4. Subscription price — DECISION NEEDED before M8

v1 ships with ad credits only, so this can wait.

**Options:** a monthly subscription, a credit pack, or both.

**Recommendation:** in v1.1, sell one monthly subscription and one credit pack. Set the numbers only after M5 has a measured cost per credit, and after you verify the store commission. Both stores take a cut of in-app purchases. The rate depends on the program you qualify for. **Verify.** No price is proposed in this plan.

### 5. Credits charged per action — DECISION NEEDED before M5

**Recommendation:** 1 credit per action. One rewarded ad grants 5 credits, so one ad covers five actions. Treat that number as provisional: M6 compares it with a real rewarded-ad payout, and the cost changes if one ad cannot cover five actions. Rewarded-ad revenue, including in Vietnam: **verify.** Do not assume an eCPM.

## Already decided

- The name is LexiMD. The old working name MarkPeek is retired.
- iOS and Android. Individual Apple and Google developer accounts, so Google's closed-test rule for personal accounts applies. Start that test as early as a real build exists.
- Free tier: local markdown editor, split view first, live preview including mermaid, dark mode, folders and tags, open/save/share `.md`. WYSIWYG is later and optional.
- Notes stay on the device. Note text is sent only when the user taps an AI action.
- A rewarded video grants 5 credits, verified by AdMob server-side verification. Sign-in (Apple, Google, email) is required for credits and for AI. Local editing works signed out.
- The server holds the AI key and the per-user credit ledger.
- One AI provider and a cheap model at first, a daily cap per user, a global spend ceiling, and cost-per-credit tracking.
- Languages: English and Vietnamese. Test from Vietnam. Minimum age 13.
- v1, v1.1, and v1.2 are the feature sets in the next sections.

The other 12-week draft assumed a stack, named models, named hosts, a second model for subscribers, RevenueCat, and a public launch campaign. This plan keeps its sequence (accounts, local editor, ledger, AI, ads, closed test, submission) and drops those assumptions. Prices and model names stay out until you verify them.

## 1. Core function

Turn a rough note into clean markdown and see it rendered, diagrams included.

That sentence is specific enough to build. If you want a different sentence, change it before M1. The milestones below all serve this sentence.

## 2. Core loop

The loop stays on the editor and finishes in under 30 seconds.

1. Open a note, or paste rough text into the one that is open.
2. Tap Format, Diagram, or Auto-tag. With no credits, skip the tap and type markdown yourself.
3. The preview updates. That is the reward: clean markdown, a rendered diagram, or tags ready to accept.

Repeat: the note shows the next cue, or you open another note and do the same. The free path (type, watch the preview) needs no account and no network. The credit path needs sign-in and one tap.

Check: one action, one visible reward, same screen, repeatable on the next note. Pass.

## 3. Screens

Cap is 7. v1 has 4. v1.1 has 5.

| # | Screen | Purpose | Ships |
| --- | --- | --- | --- |
| 1 | Library | Open an unfinished note, or start one. Folders, tags, and search are on this screen. | v1 |
| 2 | Editor | Write markdown and see the live preview, including mermaid. AI actions are a sheet on this screen. | v1 |
| 3 | Credits | Show the balance, offer one rewarded ad, and sign in when needed. | v1 |
| 4 | Settings | Dark mode, English or Vietnamese, account, privacy, delete account. | v1 |
| 5 | Paywall | Buy the subscription or a credit pack, and restore purchases. | v1.1 |

These stay sheets or system pickers, so they do not add a screen: the AI action sheet, folder and tag editing, the ad-consent dialog, the file picker, and the share sheet. Search is a field on the Library.

v1.2 shows related notes as a sheet on the Editor. OCR and voice use the system camera, photo, and microphone pickers.

## 4. Retention hook

A note is unfinished when it has no tags, or Format or Diagram has not been run on it. The Library lists unfinished notes first. Each one carries a single cue: "Clean this up", "Add a diagram", or "Tag this".

That cue is the reason to come back. If the balance is zero, the cue opens Credits, one rewarded ad grants 5 credits, and the same tap is waiting. The cue is the whole hook.

## 5. Features

### v1 — the MVP

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Split-view editor and live preview | The preview is the reward. | Keep |
| Mermaid in the preview, bundled for offline | The diagram is the reward you can see. | Keep |
| Dark mode | Keeps you in the editor. It is a setting, not a project. | Keep |
| Folders, manual tags, title and tag search | Gets you back to the note so you can repeat. | Keep |
| Open, save, and share `.md` | Gets text into the loop and out of it. | Keep |
| English and Vietnamese UI | The two languages of the product. | Keep |
| Sign-in: Apple, Google, email | Credits and AI require an account. Editing does not. | Keep |
| Format | The one-tap cleanup. | Keep |
| Diagram (prompt to mermaid) | The one-tap diagram. | Keep |
| Auto-tag, including a suggested folder | Fills the unfinished cue and makes the next visit findable. Weakest of the three actions. It stays because it is the retention hook. | Keep |
| Rewarded video to 5 credits | Refills the loop when the balance is zero. | Keep |
| Proxy, ledger, daily cap, global ceiling, cost log | Makes the credit real and bounds the spend. | Keep |
| Analytics and crash reporting | Release rehearsal. Events carry action names only, never note text. No screen. | Keep |

### v1.1 — the first update

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Subscription and one credit pack | A second way to refill the same loop. Also the purchase rehearsal. | Keep, behind the Paywall screen |
| Restore purchases | Required once a purchase exists. | Keep |
| Table, Summary, Action items, Tone | More taps with the same reward: the note gets better. New buttons on the existing AI sheet. | Keep |

### v1.2 — after the update has shipped

| Feature | Does it serve the loop? | Result |
| --- | --- | --- |
| Auto-link | Points at a next note to open. Needs notes already on the device. Sheet on the Editor. | Defer to v1.2 |
| OCR and voice import | Another way to get rough text in, then Format. Adds camera, photo, and microphone permissions and a new privacy pass. | Defer to v1.2 |

### Cut

| Feature | Why it is cut |
| --- | --- |
| WYSIWYG in v1 | Split view already delivers the reward. Optional later, and only if you still want it after v1 ships. |
| Cloud backup and sync | A second product. Notes are local. |
| A second AI provider | One provider is enough to rehearse, and enough to measure cost. |
| Favorites, word-count dashboard | They do not change the next tap. |
| Onboarding carousel | Another screen. The empty Library can say the one sentence. |
| Collaboration, user-to-user sharing, a web app | Outside the loop. |
| A public launch campaign | Outside this build. |

## 6. Milestones

Each milestone is about one pull request. Docs are updated in that same pull request. This plan is not M1. M1 is the first code.

Start the store accounts now, in parallel with M1. Enrollment and the Play closed test are on the critical path, and both are owner tasks. Steps and the tester bar are in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

### M1 — The app boots on a phone

Needs decision 1.

**Done when**

- A debug build installs on one iPhone and one Android phone.
- It shows the Library empty state, with the core-function sentence on it.
- There is no AI, no ads, and no server.

**Rehearses:** the toolchain, and installing a build while in Vietnam.

**You do:** write the stack choice under decision 1. Install the toolchain. Open the app and confirm the empty Library.

### M2 — The core loop works offline

**Done when**

- You can create, edit, and delete a note.
- Split view renders markdown and a mermaid diagram with the network off.
- You can put the note in a folder, add tags, and find it by title or tag.
- Dark mode works. The UI switches between English and Vietnamese.
- You can open, save, and share a `.md` file.
- The AI tap arrives in M5. Here the free path is enough: type or paste markdown and see the preview, in under 30 seconds.

**Rehearses:** the product loop on a device, before any account exists.

**You do:** use it yourself. If the loop is slower than 30 seconds or the preview is wrong, say so in the pull request. That blocks M3.

### M3 — First signed builds, and the Play clock starts

**Done when**

- An internal TestFlight build and a Play closed-testing build of the M2 app install on your phones.
- Signing is documented. The keystores are in a password manager, not in git.
- A secret scan of the binaries is clean.
- The privacy-policy URL is live in English and Vietnamese, covering local notes. AI and ads paragraphs can be short until those features exist, then updated in M5 and M6.

**Rehearses:** certificates, bundle ids, TestFlight, and the Play closed track. This is the earliest real build, so the closed-test clock starts here.

**You do:** finish individual Apple and Google enrollments if they are still open. Create the app records. Invite testers and tell them to stay opted in. **Verify** the current tester count and duration on Google's help page, and recruit above that count. Confirm the closed-test clock has started.

### M4 — Sign-in and the ledger

Needs decision 2.

**Done when**

- Apple, Google, and email sign-in work.
- A signed-in user has a ledger row. Recommended starting balance: 0, so the later ad path is real. Say if you want a small starter grant instead.
- Signed-out editing still works, and notes are still only on the device.
- Delete account removes the server user, the ledger, and any in-flight request text.
- The AI key is not in the app. The server does not have a note library.

**Rehearses:** a deployed server, auth consoles, Sign in with Apple, and keeping secrets on the server.

**You do:** record the backend choice. Create the auth credentials in the Apple and Google consoles. Keep every secret out of the repo and out of chat. Confirm the starting balance.

### M5 — Three AI actions

Needs decisions 3 and 5.

**Done when**

- Format, Diagram, and Auto-tag each run through the proxy, spend the agreed credits, and write the result into the local note.
- Opening or saving a note sends nothing. The first AI tap shows the disclosure and can be cancelled.
- A per-user daily cap and a global spend ceiling both stop the next call.
- Each call logs token counts and an estimated cost from a price you verified that day.
- A provider failure does not debit. A retry with the same request id does not debit twice.
- Request text is deleted within 24 hours.
- One Vietnamese note and one mermaid prompt succeed on the cheap model.

**Rehearses:** a server-side provider key, and cost-per-credit measurement.

**You do:** choose the provider and the cheap model after the spike in decision 3. Set a monthly spend alert on the provider dashboard. Set the two caps. Read one real cost log and confirm the numbers. **Verify** the token price, and whether the provider retains prompts or trains on them.

### M6 — A rewarded ad grants 5 credits

**Done when**

- The ad is opt-in from the Credits screen.
- Completing a test ad grants exactly 5 credits, once.
- A replayed callback or a bad signature grants nothing.
- The balance on screen matches the ledger. The app does not increment the balance itself.
- The EU/UK consent form is integrated. **Verify** which regions must see it, and what a Vietnam test device sees.
- After the ad, the unfinished-note cue still leads back to the same tap.

**Rehearses:** an AdMob app, a rewarded unit, and server-side verification.

**You do:** create the AdMob app and the verification keys. Watch one test ad end to end. Compare the cost log from M5 with what one test reward represents. If one ad cannot cover five actions, change decision 5 before M7.

### M7 — v1 submitted, staged rollout started

**Done when**

- Privacy policy and terms are live in English and Vietnamese, including the AI and ads facts from [SPEC.md](SPEC.md).
- Apple privacy labels and the Google Data safety form are submitted. **Verify** each question against the SDKs in the binary.
- Crash reporting and the small analytics set are on, with no note contents. You have caused one test crash and seen it.
- In-app account deletion is on the build you submit.
- A reviewer account with credits is in the review notes. The local editor works without it.
- Both stores are in review, then in a staged rollout at the smallest step the console offers. **Verify** the control.
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) is filled in for this version.
- Play production access has been applied for, which requires the closed test from M3 to have met the live tester bar. **Verify.**

**Rehearses:** store review and a partial production rollout.

**You do:** listing copy, screenshots, support URL, age and content questionnaires. Answer a rejection without adding scope. Agree before the rollout widens. Minimum age 13 is our rule; if a questionnaire comes out stricter, follow the questionnaire.

### M8 — v1.1 update through the same path

Needs decision 4.

**Done when**

- One subscription and one credit pack sell in the sandbox on both platforms.
- Restore purchases works.
- Table, Summary, Action items, and Tone are buttons on the existing AI sheet.
- The server grants those credits only after a verified purchase.
- The update goes through TestFlight, the Play test track, and then a staged production rollout.
- The release checklist is filled in a second time, for this version.

**Rehearses:** the update path, in-app purchase review, and the checklist the game will reuse.

**You do:** set the price after reading the M5 cost and the current store commission (**verify**). Create the products in both consoles. Buy one and restore it in sandbox. Agree the rollout.

v1.2 (auto-link, OCR, voice) starts only after M8 is live. It is a new permission and privacy pass, and it is outside these eight pull requests.

## 7. Accounts, legal, and store

Owner tasks. Detail and the Play tester bar are in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). **Verify** every fee and every form on the day you submit it.

- [ ] Apple Developer Program, individual. Fee published by Apple as 99 USD per year, in local currency where offered. **Verify** at enrollment.
- [ ] Google Play Console, individual. Registration fee: **verify.**
- [ ] Play closed test started at M3. Google's published rule, read on 2026-10-25, applies to personal accounts created after 13 November 2023: at least 12 testers opted in continuously for 14 days, then an application for production access. **Verify** on [Google's help page](https://support.google.com/googleplay/android-developer/answer/14151465). If the account is older, verify whether production is already unlocked, and still run the closed test.
- [ ] AdMob account and server-side verification.
- [ ] Privacy policy URL, English and Vietnamese.
- [ ] Terms of service. Subscription terms get added before M8: price, period, auto-renew, how to cancel.
- [ ] In-app disclosure before the first AI action.
- [ ] Apple privacy labels and Google Data safety form.
- [ ] In-app account deletion, including server data.
- [ ] EU/UK ad consent.
- [ ] Restore purchases on the v1.1 paywall.
- [ ] AI provider named in the policy, with retention and training terms checked. **Verify.**
- [ ] Store age and content questionnaires. Our minimum age is 13. **Verify** the questionnaire result.
- [ ] Sign in with Apple beside Google sign-in. **Verify** the current rule.
- [ ] Reviewer test account with credits.

## 8. Risks

| Risk | What we do |
| --- | --- |
| One rewarded ad pays less than five AI actions, especially with Vietnam traffic. | Measure in M5 and M6. Change the credit cost or the cap. Ad revenue: **verify.** |
| Play production stays locked until the personal-account closed test passes. | Start the closed test at M3. Recruit extra testers. The published bar on 2026-10-25 was 12 testers for 14 continuous days, for accounts created after 13 November 2023. **Verify.** |
| The preview WebView is slow, or review treats the app as a thin wrapper. | Native shell, WebView for preview only, libraries bundled offline. Test on a low-end Android phone. Apple's minimum-functionality rule: **verify.** |
| The cheap model mishandles Vietnamese or mermaid. | The provider spike in decision 3 uses both. Switch model before M5 if it fails. |
| A modified client grants itself credits. | Only a verified ad callback, or a later verified purchase, adds credits. M6 includes a replayed-callback test. |
| Note text leaks into logs, analytics, or a stored library. | Request text lives for the retry window only. Sample one analytics event and one crash before M7 submission. |
| The single provider raises prices or goes down. | Daily caps and a dashboard spend alert. Price: **verify** when it changes. |
| Apple, Play, or AdMob enrollment takes longer than expected. | Start accounts before M1 is done. **Verify** current review times. Do not plan on same-day enrollment. |
| Review rejects the AI disclosure, account deletion, or ads. | Those items are M7 acceptance criteria, not follow-up work. |
| Scope grows into WYSIWYG, sync, or OCR before v1 is live. | They are already cut or deferred. A pull request that adds them early is out of scope. |
| Signing keys are lost. | Password manager from M3. Play App Signing recovery steps: **verify** when you enroll. |

## Done

v1 is live on both stores, v1.1 has shipped through this checklist, a sandbox purchase restores, and the release checklist has been filled in for real. That is the rehearsal the life-sim game inherits.
