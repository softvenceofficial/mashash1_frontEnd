import { useState } from 'react';
import type { TextType } from './types';

export const useTextHistory = () => {
  const [history, setHistory] = useState<TextType[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = (texts: TextType[]) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push([...texts]);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { saveState, undo, redo, canUndo, canRedo };
};
