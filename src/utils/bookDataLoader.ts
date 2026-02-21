/**
 * Utility function to fetch and parse book JSON data from external URLs
 */

export const fetchBookContent = async (fileUrl: string): Promise<any> => {
  try {
    let fetchUrl = fileUrl;
    
    // Parse the URL to get just the pathname
    const url = new URL(fileUrl.replace('http://', 'https://'));
    
    if (import.meta.env.DEV) {
      // In local Dev, Vite proxy handles this
      fetchUrl = url.pathname; 
    } else {
      // IN PRODUCTION: Route through Netlify proxy
      // Replace "/media/" with "/api-media/" to trigger the _redirects rule
      fetchUrl = url.pathname.replace(/^\/media\//, '/api-media/');
    }
    
    console.log('Fetching book data from:', fetchUrl);

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    // Check Content-Type to ensure we got JSON, not HTML
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      console.error('Received HTML instead of JSON:', text.substring(0, 100));
      throw new Error('Server returned HTML (likely 404 or index.html) instead of JSON');
    }

    // Parse JSON
    const data = await response.json();
    
    // Validate that data is an array
    if (!Array.isArray(data)) {
      throw new Error('Invalid book data format: expected an array');
    }
    
    return data;
  } catch (error) {
    console.error('Error loading book JSON:', error);
    throw error;
  }
};

/**
 * Process raw book data to ensure all required fields exist
 */
export const processBookData = (data: any[]): any[] => {
  return data.map((page: any) => ({
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
};
