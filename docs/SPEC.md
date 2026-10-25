# LexiMD spec

Status: planning. This replaces the MarkPeek working-name draft (v0.2). The name is LexiMD.

LexiMD is a markdown notes app for iOS and Android. The core function, in one sentence:

**Turn a rough note into clean markdown and see it rendered, diagrams included.**

Shipping the app is also practice for a later life-sim game. The release path (signed builds, closed testing, ads, subscriptions, accounts, review, staged rollout, and an update) is part of the product goal. See [PLAN.md](PLAN.md) for sequencing and [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for the store steps.

## People and language

- One person, taking notes on a phone.
- Interface languages: English and Vietnamese. The device language is used when it is Vietnamese; otherwise English.
- Notes may be in any language. AI output follows the language of the note.
- Minimum age 13. The store age questionnaires still have to be answered, and the store rating wins if it comes out stricter. Verify at submission.
- First testing happens from Vietnam.

## Free tier

Works with no account and no network, except where a system share sheet needs one.

- A markdown editor. Split view first: source on one side, rendered preview on the other. WYSIWYG is later and optional.
- Live preview, including mermaid diagrams. Preview libraries are bundled with the app so a diagram renders offline.
- Dark mode, with a system setting and an override.
- Folders and tags, set by the user.
- Create, edit, and delete notes on the device.
- Open, save, and share `.md` files through the system file picker and share sheet.
- Search by title and tag, on the library screen.

Notes are files on the device. Folders and tags are local metadata. The app has no cloud copy of a note library.

## Credits

Sign-in is required to hold credits and to run an AI action. Local editing stays available signed out.

Sign-in methods: Apple, Google, and email.

- A rewarded video ad grants 5 credits. The ad is opt-in. Watching it is a choice from the credits screen.
- The grant is written by the server after AdMob server-side verification. The app does not add credits when the video ends.
- v1 has no subscription and no credit pack. Those arrive in v1.1.
- Each AI action spends 1 credit, decided 2026-10-25, so one ad covers five actions. That number is provisional until a real ad payout is compared with the cost log. See [PLAN.md](PLAN.md).
- Each user has a daily cap. There is also a global daily spend ceiling for the whole service. Both numbers are set when the provider is chosen, from a spend limit the owner configures on the provider dashboard.
- The server records tokens and an estimated cost on each action. The owner verifies the token price and stores that figure in server config. The app binary does not contain prices. Re-check the price when the provider changes it.

## AI actions

The user taps an action. That tap is the only time note text leaves the device.

| Action | Version | What it does |
| --- | --- | --- |
| Format | v1 | Rewrites the current note as clean markdown. Pasted text is already in the note; this action cleans it up. |
| Diagram | v1 | Writes a mermaid diagram from a prompt, into the note, and the preview renders it. |
| Auto-tag | v1 | Suggests tags and a folder for this note. The user can accept or ignore. |
| Table | v1.1 | Turns the selected text into a markdown table. |
| Summary | v1.1 | Writes a short summary into the note. |
| Action items | v1.1 | Pulls action items out of the note. |
| Tone | v1.1 | Rewrites the note in a chosen tone. |
| Auto-link | v1.2 | Suggests related notes already on the device. |
| OCR import | v1.2 | Turns a photo into text, then the user can run Format. |
| Voice import | v1.2 | Turns speech into text, then the user can run Format. |

v1 uses one AI provider and one cheap model. A second provider is out of scope until cost-per-credit is understood.

Voice and OCR add microphone, camera, and photo permissions. They wait until v1.2 so the first store review is about the editor, ads, and three text actions.

## What the server stores

The server stores:

- The account (sign-in identity).
- The credit balance and the credit transactions.
- For each AI call: the action name, token counts, estimated cost, and a request id.
- The text of an in-flight AI request, only so a retry with the same request id can return the same result without a second charge. That text is deleted within 24 hours.

The server does not keep a note library. Analytics and crash reports do not contain note text, prompts, or diagram source.

A failed provider call leaves the balance unchanged. A retried request id returns the stored result and does not debit again.

## Privacy rules

- Disclose, in the privacy policy and in the app before the first AI action: notes stay on the device; a tap sends that action's text to our server and then to the named AI provider; the server holds that text only to finish the action and a retry; the server keeps the account and the credit ledger.
- Name the provider in the disclosure once the provider is chosen.
- Check the provider's terms for retention and training use, and pick the opt-out if one exists. Verify when the provider is chosen.
- Account deletion is inside the app. It deletes the server account, the ledger, and any in-flight request text. Notes stay on the device until the user deletes them there.
- Ads use Google AdMob. EU/UK ad consent is part of the app. Testing starts in Vietnam; ship the consent flow anyway. Whether a Vietnam test device sees the form: verify.
- Subscriptions, when they exist, use Apple and Google in-app purchase, with restore purchases and the price, period, and renewal terms shown before purchase.

## Versions

**v1.** Editor, folders and tags, mermaid preview, dark mode, English and Vietnamese, sign-in, rewarded ads to credits, Format, Diagram, Auto-tag, analytics, and crash reporting.

**v1.1.** Subscription and credit packs, restore purchases, and the Table, Summary, Action items, and Tone actions. Shipped as an update through the same store path.

**v1.2.** Auto-link, OCR import, and voice import.

## Decided

- Product name: LexiMD.
- Platforms: iOS and Android. No web app in this plan.
- Developer accounts: individual Apple Developer Program and individual Google Play Console. The Play closed-test requirement for personal accounts applies. Start that test as early as a real build exists.
- Free tier, credit rules, phasing, local notes, server-side AI key, and AdMob server-side verification, as written above.
- One AI provider at first, a cheap model, per-user daily caps, a global spend ceiling, and cost-per-credit tracking.
- Mobile stack: React Native with Expo. Decided 2026-10-25.
- Backend shape: we own the AI proxy and the ad-verification endpoint, the AI key stays server-side, and the ledger is managed Postgres. Decided 2026-10-25.
- Credits: 1 per action, provisional until the ad-payout comparison. Decided 2026-10-25.

## Open

- Hosting vendor, chosen in milestone M4.
- AI provider and model name, chosen after the spike in milestone M5. No names or prices until that day. Verify the price then.
- Subscription price, needed before v1.1. One monthly subscription and one credit pack, priced from measured cost per credit and a verified store commission.

Details are in [PLAN.md](PLAN.md).

## Out of scope

Cloud backup and sync, collaboration, a web app, WYSIWYG in v1, more than one AI provider, favorites, a word-count dashboard, an onboarding carousel, and the life-sim game itself.
