import { ProfileContent } from './profile-content';

describe('Published education content (professional-home R13)', () => {
  it('shows the AI development master as completed in Spanish without invented dates', async () => {
    const response = await fetch('/content/profile.es.json');
    expect(response.ok).toBeTrue();
    const content = await response.json() as ProfileContent;
    const master = content.education.find((entry) => entry.institution === 'Universidad Isabel I');
    expect(master?.degree).toBe('Máster en Desarrollo con IA');
    expect(master?.period).toBe('Finalizado');
  });

  it('shows the same completed status in English', async () => {
    const response = await fetch('/content/profile.en.json');
    expect(response.ok).toBeTrue();
    const content = await response.json() as ProfileContent;
    const master = content.education.find((entry) => entry.institution === 'Universidad Isabel I');
    expect(master?.degree).toBe("Master's in AI-Driven Development");
    expect(master?.period).toBe('Completed');
  });
});
