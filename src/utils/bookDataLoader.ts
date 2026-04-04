/**
 * Utility function to fetch and parse book JSON data from external URLs
 */
export const fetchBookContent = async (fileUrl: string): Promise<any> => {
  try {
    let fetchUrl = fileUrl;
    const url = new URL(fileUrl.replace('http://', 'https://'));
    
    if (import.meta.env.DEV) {
      fetchUrl = url.pathname; 
    } else {
      fetchUrl = url.pathname.replace(/^\/media\//, '/api-media/');
    }

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Server returned HTML instead of JSON');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading book JSON:', error);
    throw error;
  }
};

/**
 * Process raw book data to ensure all required fields exist
 * Returns both the extracted book size and the processed pages.
 */
export const processBookData = (data: any): { bookSize: string | null, pages: any[] } => {
  let pagesToProcess = [];
  let bookSize = null;

  // Handle New Format (Object containing bookSize and pages array)
  if (data && !Array.isArray(data) && Array.isArray(data.pages)) {
    pagesToProcess = data.pages;
    bookSize = data.bookSize || null;
  } 
  // Handle Old Format (Just a raw array of pages for backward compatibility)
  else if (Array.isArray(data)) {
    pagesToProcess = data;
  } 
  else {
    console.error("Unrecognized JSON format:", data);
    return { bookSize: null, pages: [] };
  }

  const processedPages = pagesToProcess.map((page: any) => ({
    lines: page.lines || [],
    texts: page.texts || [],
    shapes: page.shapes || [],
    images: (page.images || []).map((img: any) => ({
      ...img,
      type: 'image',
      id: img.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
    })),
    stickyNotes: page.stickyNotes || [],
    tables: page.tables || [],
    background: page.background || null
  }));

  return { bookSize, pages: processedPages };
};
