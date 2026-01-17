type ShortcutCallback = (e: KeyboardEvent) => void;

class KeyboardManager {
  private shortcuts = new Map<string, ShortcutCallback>();
  private isEnabled = true;

  register(shortcut: string, callback: ShortcutCallback) {
    this.shortcuts.set(shortcut.toLowerCase(), callback);
  }

  unregister(shortcut: string) {
    this.shortcuts.delete(shortcut.toLowerCase());
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isEnabled) return;
    
    const key = this.getShortcutKey(e);
    const handler = this.shortcuts.get(key);
    
    if (handler) {
      handler(e);
    }
  };

private getShortcutKey(e: KeyboardEvent): string {
    if (!e.key) return ""; 

    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  clear() {
    this.shortcuts.clear();
  }
}

export const keyboardManager = new KeyboardManager();

// Setup global listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', keyboardManager.handleKeyDown);
}
