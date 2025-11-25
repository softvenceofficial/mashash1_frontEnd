/* eslint-disable @typescript-eslint/no-explicit-any */
interface ConvertObjectOptions {
  skipNullValues?: boolean;
  arrayIndexing?: boolean;
  nestObjectsAsJSON?: boolean;
}

/**
 * Helper function to convert FormData to a readable object for debugging
 * @param formData - The FormData object to debug
 * @returns Object representation of FormData
 */
export const formDataToObject = (formData: FormData): Record<string, any> => {
  const obj: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      obj[key] = {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      };
    } else {
      obj[key] = value;
    }
  }

  return obj;
};

/**
 * Helper function to log FormData contents to console
 * @param formData - The FormData object to log
 * @param label - Optional label for the log
 */
export const logFormData = (
  formData: FormData,
  label: string = "FormData"
): void => {
  console.log(`${label}:`, formDataToObject(formData));

  // Alternative detailed logging
  console.log(`${label} entries:`);
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(
        `  ${key}:`,
        `File(${value.name}, ${value.size} bytes, ${value.type})`
      );
    } else {
      console.log(`  ${key}:`, value);
    }
  }
};

interface ConvertObjectOptions {
  skipNullValues?: boolean;
  arrayIndexing?: boolean;
  nestObjectsAsJSON?: boolean;
}

/**
 * Alternative version that converts object properties individually to FormData
 * @param obj - The object to convert
 * @param options - Configuration options
 * @returns The converted FormData object
 */
export const convertObjectToFormData = (
  obj: Record<string, any>,
  options: ConvertObjectOptions = {}
): FormData => {
  const {
    skipNullValues = true,
    arrayIndexing = true,
    nestObjectsAsJSON = true,
  } = options;

  const formData = new FormData();

  if (!obj || typeof obj !== "object") {
    return formData;
  }

  Object.entries(obj).forEach(([key, value]) => {
    // Skip null/undefined values if specified
    if (skipNullValues && (value === null || value === undefined)) {
      return;
    }

    // Handle File/Blob objects
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(key, item);
        } else {
          const fieldName = arrayIndexing ? `${key}[${index}]` : key;
          formData.append(fieldName, String(item));
        }
      });
    }
    // Handle nested objects
    else if (typeof value === "object" && value !== null) {
      if (nestObjectsAsJSON) {
        formData.append(key, JSON.stringify(value));
      } else {
        // Flatten nested object (simple one level)
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          formData.append(`${key}.${nestedKey}`, String(nestedValue));
        });
      }
    }
    // Handle primitive values
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// TypeScript usage examples:

// Example 1: Debug FormData contents
/*
import { convertObjectToFormData, logFormData, formDataToObject } from '@/utils/formDataUtils';

const userData = {
  userName: "john_doe",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  role: "Operation",
};

const handleSubmit = () => {
  const formData = convertObjectToFormData(userData);
  
  // Method 1: Use helper function to log
  logFormData(formData, 'User Data');
  
  // Method 2: Convert to object and log
  console.log('FormData as Object:', formDataToObject(formData));
  
  // Method 3: Manual iteration
  console.log('FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
};
*/

// Example 2: Individual properties with type safety
/*
interface UserData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: File;
  preferences?: {
    theme: string;
    notifications: boolean;
  };
}

const userData: UserData = {
  userName: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'Operation',
  avatar: fileObject // File from input
};

const formData = convertObjectToFormData(userData);
*/

// Example 3: With typed options
/*
const options: ConvertObjectOptions = {
  skipNullValues: true,
  arrayIndexing: false,
  nestObjectsAsJSON: false
};

const formData = convertObjectToFormData(userData, options);
*/
