import { blogIndexUrl, blogPostUrl } from './blog-content-urls';

describe('blog content urls', () => {
  it('builds the index url (R9)', () => {
    expect(blogIndexUrl()).toBe('content/blog/index.json');
  });

  it('builds a post url from its slug (R10)', () => {
    expect(blogPostUrl('mi-entrada')).toBe('content/blog/mi-entrada.json');
  });
});
