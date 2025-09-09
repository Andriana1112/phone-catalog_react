function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function request<T>(url: string, method: string): Promise<T> {
  const options: RequestInit = { method };

  // Fix URL for GitHub Pages deployment
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://andriana1112.github.io/phone-catalog_react'
      : '';
  const fullUrl = baseUrl + url;

  return wait(500)
    .then(() => fetch(fullUrl, options))
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong with API!');
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url, 'GET'),
};
