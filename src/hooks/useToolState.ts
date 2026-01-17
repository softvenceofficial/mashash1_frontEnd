import { useState, useEffect } from 'react';

interface ToolColors {
  [key: string]: string;
}

const STORAGE_KEY = 'tool-colors';

export const useToolState = () => {
  const [toolColors, setToolColors] = useState<ToolColors>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      Text: '#000000',
      Brush: '#000000',
      Shapes: '#60a5fa',
      Color: '#CCCCCC',
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toolColors));
  }, [toolColors]);

  const updateToolColor = (tool: string, color: string) => {
    setToolColors(prev => ({ ...prev, [tool]: color }));
  };

  const getToolColor = (tool: string): string => {
    return toolColors[tool] || '#000000';
  };

  return { toolColors, updateToolColor, getToolColor };
};
