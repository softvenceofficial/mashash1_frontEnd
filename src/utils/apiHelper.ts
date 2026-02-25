import { IApiResponse } from "@/types/book.type";

/**
 * Handle API errors and extract error message
 */
export const handleApiError = (error: any): string => {
  if (error?.data?.message) {
    return error.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An error occurred. Please try again.";
};

/**
 * Check if API response is successful
 */
export const isApiSuccess = <T,>(response: IApiResponse<T> | undefined): boolean => {
  return response?.code === 200 || response?.code === 201;
};

/**
 * Extract data from API response safely
 */
export const getApiData = <T,>(response: IApiResponse<T> | undefined): T | null => {
  return response?.data || null;
};

/**
 * Create FormData from object for multipart requests
 */
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

/**
 * Retry API call with exponential backoff
 */
export const retryApiCall = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};
