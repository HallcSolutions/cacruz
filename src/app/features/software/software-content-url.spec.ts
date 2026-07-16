import { softwareContentUrl } from './software-content-url';

describe('softwareContentUrl', () => {
  it('builds the Spanish software url (R62)', () => {
    expect(softwareContentUrl('es')).toBe('content/software.es.json?v=2');
  });

  it('builds the English software url (R62)', () => {
    expect(softwareContentUrl('en')).toBe('content/software.en.json?v=2');
  });
});
