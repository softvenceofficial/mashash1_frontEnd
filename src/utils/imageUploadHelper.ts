/**
 * Helper utility for converting data URLs to File objects for upload
 */

/**
 * Converts a data URL (base64) to a File object
 * @param dataUrl - The data URL string (e.g., from canvas.toDataURL())
 * @param filename - The desired filename for the file
 * @returns Promise<File> - The converted File object
 */
export const dataUrlToFile = async (
  dataUrl: string,
  filename: string
): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
};

/**
 * Converts a Blob to a File object
 * @param blob - The Blob object
 * @param filename - The desired filename
 * @returns File - The converted File object
 */
export const blobToFile = (blob: Blob, filename: string): File => {
  return new File([blob], filename, { type: blob.type || "image/png" });
};

/**
 * Creates FormData for book update with proper multipart/form-data structure
 * @param bookData - Object containing book fields
 * @returns FormData - Ready to send to API
 */
export const createBookFormData = (bookData: {
  title: string;
  file?: File;
  cover_image?: File;
}): FormData => {
  const formData = new FormData();

  formData.append("title", bookData.title);

  if (bookData.file) {
    formData.append("file", bookData.file);
  }

  if (bookData.cover_image) {
    formData.append("cover_image", bookData.cover_image);
  }

  return formData;
};
