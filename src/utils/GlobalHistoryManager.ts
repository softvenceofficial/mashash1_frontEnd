interface HistoryAction {
  type: 'text' | 'drawing' | 'shape' | 'table' | 'image' | 'note';
  pageIndex: number;
  before: any;
  after: any;
  timestamp: number;
}

class GlobalHistoryManager {
  private history: HistoryAction[][] = [];
  private currentIndex = -1;
  private maxHistory = 50;

  addAction(action: HistoryAction) {
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push([action]);
    this.currentIndex++;
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo(): HistoryAction[] | null {
    if (this.currentIndex < 0) return null;
    return this.history[this.currentIndex--];
  }

  redo(): HistoryAction[] | null {
    if (this.currentIndex >= this.history.length - 1) return null;
    return this.history[++this.currentIndex];
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

export const globalHistory = new GlobalHistoryManager();
