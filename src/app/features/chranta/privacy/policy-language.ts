export const POLICY_LANGUAGES = ['en', 'es', 'pt'] as const;

export type PolicyLanguage = (typeof POLICY_LANGUAGES)[number];

export function isPolicyLanguage(value: unknown): value is PolicyLanguage {
  return POLICY_LANGUAGES.includes(value as PolicyLanguage);
}
