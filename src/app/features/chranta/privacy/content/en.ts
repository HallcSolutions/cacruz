import { PrivacyPolicy } from '../privacy-policy';

export const EN: PrivacyPolicy = {
  languageName: 'English',
  title: 'Chranta Privacy Policy',
  updated: 'Last updated: October 12, 2026',
  intro:
    'Chranta is a personal finance app for iPhone, iPad and Android. It was designed so that your financial information never leaves your device. This policy explains what information the app handles, where it is kept, and what we do not do with it.',
  sections: [
    {
      heading: 'Summary',
      paragraphs: [
        'We do not collect, receive, store, sell or share your personal data. Everything you enter in Chranta stays on your device, encrypted.',
      ],
      bullets: [
        'No account or sign-up is required.',
        'No servers: we do not run any backend that receives your data.',
        'No advertising, analytics, crash-reporting or tracking tools.',
        'The AI assistant runs entirely on your device and does not send your data to any third-party AI service.',
      ],
    },
    {
      heading: 'Who we are',
      paragraphs: [
        'Chranta is developed by Christian Cruz Arango, an independent developer (cacruz.com). In this policy, "we" refers to the developer.',
      ],
    },
    {
      heading: 'Information you enter in the app',
      paragraphs: [
        'To work, Chranta stores the information you choose to enter. It is saved only on your device, in a database encrypted with SQLCipher (AES-256). The encryption key is kept in the iOS Keychain or the Android Keystore. We cannot see or access this information.',
      ],
      bullets: [
        'Country, language, currency and starting balance.',
        'Income, expenses, categories and budgets.',
        'Debts, installments and fixed bills (for example rent, power or internet).',
        'Savings goals and money set aside.',
        'Your preferences, such as reminder times and whether amounts are shown.',
      ],
    },
    {
      heading: 'AI assistant (on-device)',
      paragraphs: [
        'The assistant uses an open-source language model, Qwen3-0.6B (Apache-2.0 license), that is bundled inside the app and runs locally on your device with Google’s LiteRT runtime. The model is never downloaded from or called on a remote server.',
        'What you type to the assistant, and the financial records it reads to answer you, are processed only on your device. Nothing is sent to OpenAI, Google, Anthropic or any other third-party AI service, or to us. Conversations are not stored, and the assistant never saves a record until you review and confirm it. The assistant works without an internet connection.',
      ],
    },
    {
      heading: 'Face ID, Touch ID and device passcode',
      paragraphs: [
        'You can lock Chranta with Face ID, Touch ID, fingerprint or your device passcode. Authentication is handled by the operating system: the app only receives whether it succeeded, and never has access to your biometric data.',
      ],
    },
    {
      heading: 'Payment reminders',
      paragraphs: [
        'Reminders are optional and off by default. When you turn them on, they are scheduled locally by your device’s notification system; no push service or server is involved. You decide whether bill names and amounts appear on the lock screen.',
      ],
    },
    {
      heading: 'Backups',
      paragraphs: [
        'You can export an encrypted backup protected by a passphrase you choose, and import it later. You decide where to save or share the file (for example Files, iCloud Drive or email) through your device’s share sheet; that destination handles the file under its own policy. Without your passphrase, nobody, including us, can open it.',
        'Your device’s own backups (such as iCloud or Google device backup) may include the app’s data according to your device settings; that data stays encrypted.',
      ],
    },
    {
      heading: 'Internet connection and third parties',
      paragraphs: [
        'Chranta does not need an internet connection and does not transmit your data. It does not include third-party SDKs for analytics, advertising, attribution or crash reporting, and it does not track you across apps or websites.',
        'The only action that uses the internet is an optional link to cacruz.com, which opens in your web browser. Apple and Google may collect information when you download the app, according to their own privacy policies.',
      ],
    },
    {
      heading: 'Permissions',
      paragraphs: [
        'Chranta asks only for permissions it needs, and only when you use the related feature:',
      ],
      bullets: [
        'Face ID / biometrics: to unlock the app.',
        'Notifications: only if you turn on payment reminders.',
        'File access: only when you choose a backup file to import.',
      ],
    },
    {
      heading: 'Data retention and deletion',
      paragraphs: [
        'Your information stays on your device until you delete it. You can delete any record inside the app, and uninstalling Chranta removes its data from your device. Because we do not hold any of your data, there is nothing for us to delete on our side.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'Chranta is not directed to children under 13. We do not knowingly collect information from anyone, including children.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'Since your data lives only on your device, you have full control at all times: you can view, correct, export (with a backup) and delete it directly in the app. This applies wherever you live, including under the GDPR, the CCPA and Latin American data protection laws.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If the way Chranta handles information changes, we will update this page and its date before the change reaches the app. If the app ever needs to send data off your device, it will explain what is sent and to whom, and ask for your permission first.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'For questions about this policy or about Chranta, use the contact form at cacruz.com/for-companies.',
      ],
    },
  ],
};
