import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as jessibuca from './useJessibuca';

describe('jessibuca player asset', () => {
  it('declares the fullscreen document reference before feature detection uses it', () => {
    const script = readFileSync(
      resolve(
        process.cwd(),
        'apps/web-antd/public/script/jessibuca/jessibuca.js',
      ),
      'utf8',
    );

    const featureDetectionIndex = script.indexOf('e[1]in t');
    const documentReferenceIndex = script.indexOf(
      'const t=typeof window !== "undefined" &&void 0!==window.document?window.document',
    );

    expect(featureDetectionIndex).toBeGreaterThanOrEqual(0);
    expect(
      documentReferenceIndex === -1 ||
        documentReferenceIndex < featureDetectionIndex,
    ).toBe(true);
  });
});

describe('loadJessibucaScript', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    delete (window as any).Jessibuca;
    delete (window as any).jessibuca;
    vi.restoreAllMocks();
  });

  it('rejects when the loaded script does not expose a constructor', async () => {
    let capturedScript: HTMLScriptElement | undefined;
    vi.spyOn(document.head, 'append').mockImplementation((...nodes) => {
      capturedScript = nodes.find(
        (node): node is HTMLScriptElement => node instanceof HTMLScriptElement,
      );
    });

    const promise = (jessibuca as any).loadJessibucaScript();

    expect(capturedScript).toBeTruthy();
    capturedScript?.dispatchEvent(new Event('load'));

    await expect(promise).rejects.toThrow('Jessibuca player failed to load');
  });
});
