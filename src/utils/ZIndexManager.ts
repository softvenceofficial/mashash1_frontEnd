// Helper types for ZIndexManager
interface PageItem {
  id?: string;
  zIndex?: number;
  [key: string]: any;
}

interface PageDataExtended {
  texts?: PageItem[];
  images?: PageItem[];
  shapes?: PageItem[];
  tables?: PageItem[];
  stickyNotes?: PageItem[];
  lines?: PageItem[];
}

export const Z_INDEX_LAYERS = {
  BACKGROUND: 0,
  DEFAULT: 100,
  FOREGROUND: 200,
  TOOLTIP: 1000,
  MODAL: 1100,
};

export const getAllPageItems = (page: PageDataExtended) => {
  return [
    ...(page.texts || []).map(i => ({ ...i, _type: 'text' })),
    ...(page.images || []).map(i => ({ ...i, _type: 'image' })),
    ...(page.shapes || []).map(i => ({ ...i, _type: 'shape' })),
    ...(page.tables || []).map(i => ({ ...i, _type: 'table' })),
    ...(page.stickyNotes || []).map(i => ({ ...i, _type: 'stickyNote' })),
    ...(page.lines || []).map(i => ({ ...i, _type: 'line' })),
  ];
};

export const getMaxZIndex = (page: PageDataExtended): number => {
  const allItems = getAllPageItems(page);
  if (allItems.length === 0) return 0;
  return Math.max(...allItems.map((i: any) => i.zIndex || 0));
};

export const getMinZIndex = (page: PageDataExtended): number => {
  const allItems = getAllPageItems(page);
  if (allItems.length === 0) return 0;
  return Math.min(...allItems.map((i: any) => i.zIndex || 0));
};
