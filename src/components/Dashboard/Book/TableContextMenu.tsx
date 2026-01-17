/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';

interface TableContextMenuProps {
  x: number;
  y: number;
  onAction: (action: string, value?: any) => void;
  onClose: () => void;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({ x, y, onAction, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action: string, value?: any) => {
    onAction(action, value);
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[1001] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[180px]"
      style={{ left: x, top: y }}
    >
      <button onClick={() => handleAction('insertRow', 'above')} className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-indigo-600 hover:text-white text-left">
        ↑ Insert Row Above
      </button>
      <button onClick={() => handleAction('insertRow', 'below')} className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-indigo-600 hover:text-white text-left">
        ↓ Insert Row Below
      </button>
      <div className="border-t border-zinc-700 my-1" />
      <button onClick={() => handleAction('insertColumn', 'left')} className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-indigo-600 hover:text-white text-left">
        ← Insert Column Left
      </button>
      <button onClick={() => handleAction('insertColumn', 'right')} className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-indigo-600 hover:text-white text-left">
        → Insert Column Right
      </button>
      <div className="border-t border-zinc-700 my-1" />
      <button onClick={() => handleAction('mergeCells')} className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-blue-600 hover:text-white text-left">
        Merge Cells
      </button>
      <div className="border-t border-zinc-700 my-1" />
      <button onClick={() => handleAction('deleteRow')} className="w-full px-4 py-2 text-sm text-red-300 hover:bg-red-600 hover:text-white text-left">
        Delete Row
      </button>
      <button onClick={() => handleAction('deleteColumn')} className="w-full px-4 py-2 text-sm text-red-300 hover:bg-red-600 hover:text-white text-left">
        Delete Column
      </button>
    </div>
  );
};

export default TableContextMenu;
