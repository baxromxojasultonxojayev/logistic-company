const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type RequestOptions<T = void> = {
  headers?: Record<string, string>;
  method?: string;
  body?: T;
  locale?: string;
};

async function apiRequest<TResponse, TBody = void>(
  endpoint: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { method = "GET", body, headers = {}, locale } = options;

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let activeLocale = locale;

  if (typeof window !== "undefined") {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];

    if (cookieValue) {
      activeLocale = cookieValue;
    }
  }

  const finalLocale = activeLocale || "uz";
  const url = `${BASE_URL}${cleanEndpoint}`;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      "Accept-Language": finalLocale,
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(
        errorData.message ||
          `API Error: ${response.status} ${response.statusText}`,
      );
    }

    const result = (await response.json()) as ApiResponse<TResponse>;
    return result.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown API error";
    console.error("API Request failed:", errorMessage);
    throw new Error(errorMessage);
  }
}

export const api = {
  get: <TResponse>(endpoint: string, options?: RequestOptions) =>
    apiRequest<TResponse>(endpoint, { ...options, method: "GET" }),

  post: <TResponse, TBody>(
    endpoint: string,
    data?: TBody,
    options?: RequestOptions<TBody>,
  ) =>
    apiRequest<TResponse, TBody>(endpoint, {
      ...options,
      method: "POST",
      body: data,
    }),

  put: <TResponse, TBody>(
    endpoint: string,
    data?: TBody,
    options?: RequestOptions<TBody>,
  ) =>
    apiRequest<TResponse, TBody>(endpoint, {
      ...options,
      method: "PUT",
      body: data,
    }),

  patch: <TResponse, TBody>(
    endpoint: string,
    data?: TBody,
    options?: RequestOptions<TBody>,
  ) =>
    apiRequest<TResponse, TBody>(endpoint, {
      ...options,
      method: "PATCH",
      body: data,
    }),

  delete: <TResponse>(endpoint: string, options?: RequestOptions) =>
    apiRequest<TResponse>(endpoint, { ...options, method: "DELETE" }),
};
