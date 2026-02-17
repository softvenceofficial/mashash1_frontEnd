import { useState, useCallback, useEffect } from 'react';
import type { PageData } from './types';

const HISTORY_KEY = 'universal_book_history';
const FUTURE_KEY = 'universal_book_future';
const MAX_HISTORY_STEPS = 20;

export const useBookHistory = () => {
  const [history, setHistory] = useState<PageData[][]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [future, setFuture] = useState<PageData[][]>(() => {
    try {
      const stored = localStorage.getItem(FUTURE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      localStorage.setItem(FUTURE_KEY, JSON.stringify(future));
    } catch (e) {
      console.warn('Failed to save history to localStorage:', e);
    }
  }, [history, future]);

  const addToHistory = useCallback((currentPages: PageData[]) => {
    const snapshot = JSON.parse(JSON.stringify(currentPages));
    setHistory(prev => {
      const newHistory = [...prev, snapshot];
      if (newHistory.length > MAX_HISTORY_STEPS) {
        return newHistory.slice(newHistory.length - MAX_HISTORY_STEPS);
      }
      return newHistory;
    });
    setFuture([]);
  }, []);

  const undo = useCallback((currentPages: PageData[]) => {
    if (history.length === 0) return null;

    const previousPages = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    const currentSnapshot = JSON.parse(JSON.stringify(currentPages));
    setFuture(prev => [currentSnapshot, ...prev]);
    setHistory(newHistory);

    return previousPages;
  }, [history]);

  const redo = useCallback((currentPages: PageData[]) => {
    if (future.length === 0) return null;

    const nextPages = future[0];
    const newFuture = future.slice(1);

    const currentSnapshot = JSON.parse(JSON.stringify(currentPages));
    setHistory(prev => [...prev, currentSnapshot]);
    setFuture(newFuture);

    return nextPages;
  }, [future]);

  return {
    addToHistory,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0
  };
};
