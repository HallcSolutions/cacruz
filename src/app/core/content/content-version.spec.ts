import { withContentVersion } from './content-version';

describe('withContentVersion', () => {
  it('marca la url con la versión del contenido', () => {
    expect(withContentVersion('content/blog/index.json')).toBe('content/blog/index.json?v=2');
  });

  it('marca cualquier url de contenido, no solo el índice', () => {
    expect(withContentVersion('content/profile.es.json')).toBe('content/profile.es.json?v=2');
    expect(withContentVersion('content/software.en.json')).toBe('content/software.en.json?v=2');
  });
});
