export const DESIGN_SYSTEM = {
  colors: {
    primary: '#6366f1',
    secondary: '#27272a',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    text: {
      primary: '#ffffff',
      secondary: '#d4d4d8',
      disabled: '#71717a',
    },
    background: {
      primary: '#2B2B2B',
      secondary: '#27272a',
      hover: 'rgba(255, 255, 255, 0.1)',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  }
} as const;

export type DesignSystem = typeof DESIGN_SYSTEM;
