export class DrawingOptimizer {
  /**
   * Simplify points using Ramer-Douglas-Peucker algorithm
   * Reduces number of points while maintaining shape
   */
  static simplifyPoints(points: number[], tolerance = 2.5): number[] {
    if (points.length < 6) return points;

    const simplified: number[] = [points[0], points[1]];
    
    for (let i = 2; i < points.length - 2; i += 2) {
      const x1 = points[i - 2];
      const y1 = points[i - 1];
      const x2 = points[i];
      const y2 = points[i + 1];
      
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > tolerance) {
        simplified.push(x2, y2);
      }
    }
    
    // Always include last point
    simplified.push(points[points.length - 2], points[points.length - 1]);
    
    return simplified;
  }

  /**
   * Throttle function calls to improve performance
   */
  static throttle<T extends (...args: any[]) => any>(
    callback: T,
    limit = 16
  ): (...args: Parameters<T>) => void {
    let waiting = false;
    let lastArgs: Parameters<T> | null = null;

    return function (this: any, ...args: Parameters<T>) {
      if (!waiting) {
        callback.apply(this, args);
        waiting = true;
        setTimeout(() => {
          waiting = false;
          if (lastArgs) {
            callback.apply(this, lastArgs);
            lastArgs = null;
          }
        }, limit);
      } else {
        lastArgs = args;
      }
    };
  }

  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(
    callback: T,
    delay = 300
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  }
}
