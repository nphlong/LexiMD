# Release checklist

Use this list for every LexiMD release. A line marked **verify** depends on a store rule or a price that changes. Check the live page before acting on it.

Figures and steps in the Google Play section were read from [Google's personal-account testing help page](https://support.google.com/googleplay/android-developer/answer/14151465) on 2026-10-25. Confirm that page again on the day you open a track.

Fill this in once per release:

- Product:
- Version:
- Date:
- Owner:

## 1. Accounts and ids

- [ ] Apple Developer Program, enrolled as an **individual**. The seller name on the App Store is the personal legal name. Annual fee: Apple publishes 99 USD, charged in local currency where it offers one. **Verify** the amount at enrollment. A free Apple Account can run on your own device; TestFlight and the store need the paid program. **Verify.**
- [ ] Google Play Console, enrolled as an **individual**. Registration fee: **verify** the amount on the signup page.
- [ ] AdMob account, when the app shows ads. Policy and app-link steps: **verify.**
- [ ] Bundle id (iOS) and application id (Android) chosen and registered.
- [ ] App records created in App Store Connect and Play Console.
- [ ] Support email and a public privacy-policy URL. LexiMD needs the policy in English and Vietnamese.

Account review can take longer than a day. **Verify** current times. Start enrollment before the first signed build.

## 2. Signing

- [ ] iOS distribution certificate and provisioning profile created. Version and build number increased for this release.
- [ ] Android upload key created. Play App Signing enabled. Version code increased. Ship an AAB.
- [ ] Keystores, certificates, and passwords live in a password manager. They are not in git. A note says where they are, without the secrets.
- [ ] The release binary contains no AI provider key and no `.env` file. Confirm with a secret scan of the build.
- [ ] You can produce the same build again from the recorded steps.

## 3. TestFlight

- [ ] Archive uploaded.
- [ ] Internal testers install first. Whether internal testing skips Beta App Review: **verify** for this account.
- [ ] External testers, if used, go through Beta App Review. **Verify.**
- [ ] Export-compliance / encryption question answered. Standard HTTPS is often exempt. **Verify.**
- [ ] Smoke test on a device: cold start, the core loop, offline editing, sign-in, one AI action, one rewarded ad, account deletion. Restore purchases when the build has them.
- [ ] A reviewer account exists, with credits, so AI can be tried without watching an ad. Local editing works with no account.

## 4. Google Play testing

Personal Play Console accounts created after 13 November 2023 have to pass a closed test before production. LexiMD follows that rule. If the account is older, **verify** whether production is already unlocked, and still run the closed test. **Verify** the live rule on the help page above before you rely on the numbers.

As published on that page on 2026-10-25:

- Internal testing has no tester minimum and can start before full app setup. Builds are usually available quickly.
- Closed testing needs app setup completed. At least **12 testers** must be opted in **continuously for the preceding 14 days** before you apply for production access.
- A tester who opts out does not keep their days. Those 14 days have to be consecutive.
- Production stays locked until you apply and Google approves. The page says review usually takes seven days or less and can take longer. **Verify.**
- The application asks about the closed test, the app, and production readiness, including how feedback was collected and what you changed.
- Open testing becomes available after production access.

Do this:

- [ ] Put the first real build on the internal track, then on the closed track. For LexiMD that is milestone M3, while split view is the editor. Later milestones, including WYSIWYG, upload to the same track.
- [ ] Invite testers and tell them to stay opted in for 14 days. Invite more than 12 so one dropout still leaves enough.
- [ ] Give testers a feedback channel. Keep the feedback. The production-access form asks for a summary.
- [ ] Read Play's pre-launch report for that build.
- [ ] Apply for production access only after the tester bar is met and the app matches the policy list in section 6.

## 5. Store listing assets

**Verify** pixel sizes, device classes, and required fields in each console at upload time. They change.

- [ ] App name, short description, and full description. LexiMD: English and Vietnamese.
- [ ] Icon, including the large store icon.
- [ ] Screenshots for each required device size. Use the real core loop, not a mock that the build cannot do.
- [ ] Play feature graphic, if the console still requires one. **Verify.**
- [ ] Keywords or promotional text fields the console offers. **Verify** which fields exist.
- [ ] Category, support URL, privacy policy URL.
- [ ] Content rating and age-rating questionnaires. LexiMD's own minimum age is 13. Follow the questionnaire result if it is stricter. **Verify.**

## 6. Policy, privacy, and payments

Complete the items that match the version you are shipping. LexiMD ships the v1 set by the first release, and the purchase items with v1.1.

- [ ] Privacy policy published and linked. For the v1 release it states: notes stay on the device; an AI tap sends that action's text to our server and then to the named provider; the server keeps that text only to finish the action and a retry, then deletes it within 24 hours; the server keeps the account and the credit ledger; ads are Google AdMob.
- [ ] Before the v1.3 sync release, update the privacy policy, the in-app disclosure, the Apple privacy labels, and the Google Data safety form. Signed-in notes are then stored on the server, encrypted at rest, and deleted with the account. Offline editing still works. Sync is not an AI request.
- [ ] The same AI disclosure appears in the app before the first AI action, with a way to cancel.
- [ ] Provider terms checked for retention and training use. Opt out if the provider allows it. **Verify** when the provider is chosen.
- [ ] Apple privacy nutrition labels filled in. **Verify** each question against the SDKs you actually linked (ads, sign-in, crash reporting, analytics).
- [ ] Google Data safety form filled in. **Verify** the same way.
- [ ] In-app account deletion. It removes the server account, the ledger, and in-flight AI text. From v1.3 it also removes synced notes. Say what happens to files that remain on the device.
- [ ] EU/UK ad consent (Google's UMP or the current equivalent) before a personalized ad. **Verify** the required regions and whether a Vietnam test device is shown the form.
- [ ] Rewarded ads are opt-in. Credits come from the server after AdMob server-side verification.
- [ ] In-app purchases, when present, go through Apple and Google billing. Restore purchases is visible. Price, period, auto-renew, and how to cancel are shown before purchase.
- [ ] Store commission: both stores take a cut, and the rate depends on the program you qualify for. **Verify** the rate before setting a price. No price belongs in this checklist.
- [ ] Sign in with Apple is offered alongside Google sign-in. **Verify** the current rule.
- [ ] Reviewer notes include a test account and the path through the core loop.

## 7. Submit

- [ ] Release notes written.
- [ ] Staged or phased release turned on. **Verify** the control and the percentages each console offers.
- [ ] Production submission sent on both stores. On Play, this follows production-access approval.
- [ ] Reviewer questions answered. A rejection comes back to this list, gets fixed, and is resubmitted. It does not grow a new feature.

## 8. Staged rollout

- [ ] Start at the smallest stage the console offers. **Verify.**
- [ ] Watch crash reporting and store ratings before widening.
- [ ] Halt the rollout if crashes jump or the core loop breaks. Move to the hotfix section.
- [ ] Widen only when the owner agrees.
- [ ] Write down what broke and what you would do earlier on the next LexiMD release.

## 9. Hotfix

- [ ] Branch from the version that is live.
- [ ] Change the fix only. Leave the next feature for the next planned release.
- [ ] Increase the build number. Run sections 2, 3, 4, and 7 again in short form.
- [ ] Halt a bad staged rollout, then ship the fix to the same track.
- [ ] Expedited review, if a console offers it: **verify** whether this release qualifies. Do not depend on it.

## 10. The update, a second pass

LexiMD's v1.1 (subscriptions, credit packs, and the next AI actions) is the first time this section is used. Each later version uses it the same way.

- [ ] New version number.
- [ ] Store products created (subscription and packs), in both consoles, before the build that sells them.
- [ ] Sandbox purchase and restore tested on iOS and Android.
- [ ] Privacy labels and Data safety updated if the new version collects anything new.
- [ ] The update goes through TestFlight and the Play test track, then production, staged.
- [ ] This checklist is filled in again for that version.

## 11. Leave a note for the next release

- [ ] What the consoles rejected, and the fix.
- [ ] How long enrollment, closed testing, review, and rollout actually took.
- [ ] Where the signing keys are.
- [ ] Which **verify** lines had changed since this document was written.
