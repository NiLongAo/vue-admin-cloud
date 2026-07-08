import { describe, expect, it } from 'vitest';

import { resolveNoticeImageUrl } from './richTextImageUpload';

describe('notice rich text image upload', () => {
  it('uses fullPath from upload response first', () => {
    expect(
      resolveNoticeImageUrl({
        fullPath: 'https://cdn.example.com/image.png',
        path: '/notice/image.png',
      }),
    ).toBe('https://cdn.example.com/image.png');
  });

  it('supports array responses like the legacy Tinymce uploader', () => {
    expect(
      resolveNoticeImageUrl([
        {
          fullPath: 'https://cdn.example.com/legacy-image.png',
        },
      ]),
    ).toBe('https://cdn.example.com/legacy-image.png');
  });

  it('does not fall back to relative path because legacy content stores full image urls', () => {
    expect(
      resolveNoticeImageUrl({
        path: '/notice/image.png',
      }),
    ).toBe('');
  });
});
