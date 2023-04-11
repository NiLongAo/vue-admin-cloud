import type { AxiosRequestConfig } from 'axios';

// ���ڴ洢ÿ������ı�ʶ��ȡ������
const pendingMap = new Map<string, AbortController>();

const getPendingUrl = (config: AxiosRequestConfig): string => {
  return [config.method, config.url].join('&');
};

export class AxiosCanceler {
  /**
   * �������
   * @param config ��������
   */
  public addPending(config: AxiosRequestConfig): void {
    this.removePending(config);
    const url = getPendingUrl(config);
    const controller = new AbortController();
    config.signal = config.signal || controller.signal;
    if (!pendingMap.has(url)) {
      // �����ǰ�����ڵȴ��У�������ӵ��ȴ���
      pendingMap.set(url, controller);
    }
  }

  /**
   * ������еȴ��е�����
   */
  public removeAllPending(): void {
    pendingMap.forEach((abortController) => {
      if (abortController) {
        abortController.abort();
      }
    });
    this.reset();
  }

  /**
   * �Ƴ�����
   * @param config ��������
   */
  public removePending(config: AxiosRequestConfig): void {
    const url = getPendingUrl(config);
    if (pendingMap.has(url)) {
      // �����ǰ�����ڵȴ��У�ȡ����������ӵȴ����Ƴ�
      const abortController = pendingMap.get(url);
      if (abortController) {
        abortController.abort(url);
      }
      pendingMap.delete(url);
    }
  }

  /**
   * ����
   */
  public reset(): void {
    pendingMap.clear();
  }
}
