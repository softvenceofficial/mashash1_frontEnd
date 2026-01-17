import { create } from 'zustand';
import type { ReactNode } from 'react';

interface ContextMenu {
  id: string;
  x: number;
  y: number;
  content: ReactNode;
}

interface ContextMenuStore {
  activeMenu: ContextMenu | null;
  showMenu: (id: string, x: number, y: number, content: ReactNode) => void;
  closeMenu: () => void; 
}

export const useContextMenuStore = create<ContextMenuStore>((set) => ({
  activeMenu: null,
  showMenu: (id: string, x: number, y: number, content: ReactNode) => {
    set({ activeMenu: { id, x, y, content } });
  },
  closeMenu: () => {
    set({ activeMenu: null });
  },
}));
