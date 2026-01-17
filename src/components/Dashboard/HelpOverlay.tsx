import { useState } from 'react';
import { X, Keyboard, Mouse, Zap } from 'lucide-react';
import { Z_INDEX_LAYERS } from '@/utils/ZIndexManager';

export const HelpOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'Z'], action: 'Undo' },
    { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo' },
    { keys: ['Ctrl', 'Y'], action: 'Redo (alternative)' },
    { keys: ['Space'], action: 'Toggle Pan Tool' },
    { keys: ['Escape'], action: 'Return to Select Tool' },
    { keys: ['Ctrl', '+'], action: 'Zoom In' },
    { keys: ['Ctrl', '-'], action: 'Zoom Out' },
    { keys: ['Delete'], action: 'Delete Selected' },
    { keys: ['Ctrl', 'C'], action: 'Copy' },
    { keys: ['Ctrl', 'V'], action: 'Paste' },
    { keys: ['Ctrl', 'X'], action: 'Cut' },
  ];

  const tips = [
    'Hold Ctrl to multi-select items',
    'Double-click text to edit',
    'Right-click for context menu',
    'Colors persist between tools',
    'Use Space for quick pan',
    'Zoom controls are always visible on the right',
  ];

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
        style={{ zIndex: Z_INDEX_LAYERS.TOOLTIP }}
        aria-label="Show help"
        title="Keyboard Shortcuts & Tips"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {/* Help Modal */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"
          style={{ zIndex: Z_INDEX_LAYERS.MODAL }}
          onClick={() => setIsVisible(false)}
        >
          <div 
            className="bg-[#2B2B2B] rounded-xl p-6 max-w-3xl max-h-[80vh] overflow-y-auto border border-zinc-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Quick Guide
              </h2>
              <button
                onClick={() => setIsVisible(false)}
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Close help"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Keyboard Shortcuts */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-primary" />
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd 
                            key={i}
                            className="px-2 py-1 text-xs font-mono bg-zinc-700 text-white rounded border border-zinc-600"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                      <span className="text-sm text-zinc-300">{shortcut.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Tricks */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Mouse className="w-5 h-5 text-primary" />
                  Tips & Tricks
                </h3>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-2 p-2 rounded bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-sm text-zinc-300">{tip}</span>
                    </li>
                  ))}
                </ul>

                {/* Tool Features */}
                <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h4 className="text-sm font-bold text-primary mb-2">New Features</h4>
                  <ul className="text-xs text-zinc-300 space-y-1">
                    <li>✨ Colors now persist between tool switches</li>
                    <li>✨ Global zoom controls always visible</li>
                    <li>✨ Improved drawing performance</li>
                    <li>✨ Unified undo/redo across all tools</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-700 text-center">
              <button
                onClick={() => setIsVisible(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
