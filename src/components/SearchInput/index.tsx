import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

type TSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  debounceDelay?: number;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  value,
  onChange,
  debounceDelay = 500,
  placeholder = "Search",
  className,
  ...rest
}: TSearchInputProps) {
  const [internalValue, setInternalValue] = useState<string>(value);

  // Sync external value changes with internal state
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [internalValue, debounceDelay, onChange, value]);

  return (
    <div
      className={cn(
        "border-border flex items-center rounded-md border px-4 py-2 md:px-6 md:py-2.5",
        className
      )}
    >
      <Search className="text-muted-foreground mr-1 size-4" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="font-Poppins placeholder:text-muted-foreground text-muted-foreground flex-1 bg-transparent text-sm font-light focus:outline-none"
        aria-label="Search product"
        {...rest}
      />
    </div>
  );
}
