interface ToolbarButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ToolbarButton = ({ children, isActive, onClick, className = "" }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    className={`
      h-9 min-w-[36px] px-2 rounded-lg flex items-center justify-center transition-all duration-200
      hover:bg-white/10 active:scale-95
      ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}
      ${className}
    `}
  >
    {children}
  </button>
);
