// src/core/HTTPTransport.ts

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Method = (typeof METHODS)[keyof typeof METHODS];

type RequestOptions = {
  method: Method;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
};

function queryStringify(data: Record<string, unknown>): string {
  if (!data) return '';

  const entries = Object.entries(data);

  if (entries.length === 0) {
    return '';
  }

  const params = entries
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `?${params}`;
}

export class HTTPTransport {
  get(url: string, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request(url, { ...options, method: METHODS.GET });
  }

  post(url: string, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request(url, { ...options, method: METHODS.POST });
  }

  put(url: string, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request(url, { ...options, method: METHODS.PUT });
  }

  delete(url: string, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request(url, { ...options, method: METHODS.DELETE });
  }

  request(url: string, options: RequestOptions): Promise<XMLHttpRequest> {
    const {
      method,
      data,
      headers = {},
      timeout = 5000,
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      let fullUrl = url;

      // Для GET — данные в query string
      if (method === METHODS.GET && data && typeof data === 'object') {
        fullUrl += queryStringify(data as Record<string, unknown>);
      }

      xhr.open(method, fullUrl);

      xhr.timeout = timeout;
      xhr.withCredentials = true; // понадобится для API чатов

      // Заголовки
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => resolve(xhr);
      xhr.onerror = reject;
      xhr.onabort = reject;
      xhr.ontimeout = reject;

      // Отправка тела
      if (method === METHODS.GET || data == null) {
        xhr.send();
      } else {
        // Если это не FormData — считаем, что это JSON
        if (!(data instanceof FormData)) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send(data);
        }
      }
    });
  }
}
