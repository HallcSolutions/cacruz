import { PolicySection } from './policy-section';

export interface PrivacyPolicy {
  readonly languageName: string;
  readonly title: string;
  readonly updated: string;
  readonly intro: string;
  readonly sections: readonly PolicySection[];
}
