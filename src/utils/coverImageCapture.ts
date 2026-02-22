import { dataUrlToFile } from "./imageUploadHelper";

/**
 * Captures the book cover from Konva stage and converts it to a File object
 * @param getCoverImageFn - Function that returns the cover image data URL from the Book component
 * @returns Promise<File> - The cover image as a File object ready for upload
 */
export const captureCoverImage = async (
  getCoverImageFn: () => string | null | Promise<string | null>
): Promise<File | null> => {
  const dataUrl = await getCoverImageFn();
  
  if (!dataUrl) {
    console.warn("No cover image available to capture");
    return null;
  }

  try {
    const file = await dataUrlToFile(dataUrl, "cover_image.png");
    return file;
  } catch (error) {
    console.error("Failed to convert cover image to file:", error);
    return null;
  }
};

/**
 * Captures cover and creates FormData ready for API upload
 * @param getCoverImageFn - Function that returns the cover image data URL
 * @param additionalData - Optional additional form fields (e.g., title, book_id)
 * @returns Promise<FormData | null>
 */
export const createCoverFormData = async (
  getCoverImageFn: () => string | null | Promise<string | null>,
  additionalData?: Record<string, string | number>
): Promise<FormData | null> => {
  const coverFile = await captureCoverImage(getCoverImageFn);
  
  if (!coverFile) return null;

  const formData = new FormData();
  formData.append("cover_image", coverFile);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  return formData;
};