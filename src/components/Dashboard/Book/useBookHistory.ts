import { useState, useCallback } from 'react';
import type { PageData } from './types';

interface HistoryEntry {
  pageIndex: number;
  data: PageData;
}

export const useBookHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);

  const addToHistory = useCallback((pageIndex: number, pageData: PageData) => {
    const snapshot = JSON.parse(JSON.stringify(pageData));
    setHistory(prev => [...prev, { pageIndex, data: snapshot }]);
    setFuture([]);
  }, []);

  const undo = useCallback((currentPageData: PageData, currentPageIndex: number) => {
    if (history.length === 0) return null;

    const previousEntry = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    const currentSnapshot = JSON.parse(JSON.stringify(currentPageData));
    setFuture(prev => [{ pageIndex: currentPageIndex, data: currentSnapshot }, ...prev]);
    setHistory(newHistory);

    return previousEntry;
  }, [history]);

  const redo = useCallback((currentPageData: PageData, currentPageIndex: number) => {
    if (future.length === 0) return null;

    const nextEntry = future[0];
    const newFuture = future.slice(1);

    const currentSnapshot = JSON.parse(JSON.stringify(currentPageData));
    setHistory(prev => [...prev, { pageIndex: currentPageIndex, data: currentSnapshot }]);
    setFuture(newFuture);

    return nextEntry;
  }, [future]);

  return {
    addToHistory,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0
  };
};
