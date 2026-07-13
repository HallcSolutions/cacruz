import { profileContentUrl } from './profile-content-url';

describe('profileContentUrl', () => {
  it('builds the Spanish profile url (R13)', () => {
    expect(profileContentUrl('es')).toBe('content/profile.es.json');
  });

  it('builds the English profile url (R13)', () => {
    expect(profileContentUrl('en')).toBe('content/profile.en.json');
  });
});
