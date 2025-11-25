import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  name?: string;
  required?: boolean;
}

export default function SelectInput({
  options,
  placeholder = "Select an option",
  label,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  triggerClassName = "w-[180px]",
  contentClassName,
  name,
  required = false,
  ...props
}: SelectInputProps) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
      {...props}
    >
      <SelectTrigger
        className={cn("text-muted-foreground text-sm", triggerClassName)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="text-muted-foreground"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
