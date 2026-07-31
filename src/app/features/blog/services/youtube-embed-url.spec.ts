import { youtubeEmbedUrl } from './youtube-embed-url';

describe('youtubeEmbedUrl', () => {
  it('builds the embed URL of a video from its id', () => {
    expect(youtubeEmbedUrl('EPOqpGNwVFw')).toBe(
      'https://www.youtube-nocookie.com/embed/EPOqpGNwVFw',
    );
  });

  it('escapes the id so it cannot extend the URL', () => {
    expect(youtubeEmbedUrl('abc/../otro?autoplay=1')).toBe(
      'https://www.youtube-nocookie.com/embed/abc%2F..%2Fotro%3Fautoplay%3D1',
    );
  });
});
