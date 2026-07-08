import { upload_file } from '#/api/sys/upload';

export function resolveNoticeImageUrl(response: unknown): string {
  if (!response || typeof response !== 'object') {
    return '';
  }

  const data = Array.isArray(response)
    ? response[0]
    : (response as Record<string, unknown>);
  if (!data || typeof data !== 'object') {
    return '';
  }

  const fullPath = (data as Record<string, unknown>).fullPath;
  return typeof fullPath === 'string' ? fullPath.trim() : '';
}

export function uploadNoticeRichTextImage(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    upload_file({
      file,
      onError: reject,
      onProgress: ({ percent }) => onProgress?.(percent),
      onSuccess: (data) => {
        const url = resolveNoticeImageUrl(data);
        if (!url) {
          reject(new Error('图片上传返回地址为空'));
          return;
        }
        resolve(url);
      },
      type: 4,
    });
  });
}
