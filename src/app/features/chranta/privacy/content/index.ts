import { PolicyLanguage } from '../policy-language';
import { PrivacyPolicy } from '../privacy-policy';
import { EN } from './en';
import { ES } from './es';
import { PT } from './pt';

export const PRIVACY_POLICIES: Record<PolicyLanguage, PrivacyPolicy> = { en: EN, es: ES, pt: PT };
