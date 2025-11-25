import useTheme from "@/theme";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center">
      <label
        htmlFor="theme-toggle"
        className="flex items-center cursor-pointer"
      >
        {/* Toggle container */}
        <div className="relative">
          {/* Input (hidden) */}
          <input
            type="checkbox"
            id="theme-toggle"
            className="sr-only"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          {/* Track */}
          <div className="w-12 h-6 bg-primary rounded-full shadow-inner dark:bg-gray-700 transition-colors duration-300">
            {/* Thumb with icon */}
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                theme === "dark"
                  ? "translate-x-6 bg-primary"
                  : "translate-x-0 bg-white"
              }`}
            >
              {theme === "dark" ? (
                <Moon size={16} />
              ) : (
                <Sun className="w-3 h-3" />
              )}
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}
