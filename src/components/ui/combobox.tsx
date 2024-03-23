import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// TypeScript interface
interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  placeholder: string;
  value?: string; // Make `value` optional
  onChange: (newValue: string) => void;
  containerClassName?: string;
  contentClassName?: string;
  optionClassName?: string;
  searchBar?: boolean;
}

// Adjusted Combobox component
export default function Combobox({
  options,
  placeholder,
  value: initialValue,
  onChange,
  containerClassName,
  contentClassName,
  optionClassName,
  searchBar = true,
}: ComboboxProps): JSX.Element {
  const [open, setOpen] = React.useState(false);

  // Determine the initial value
  const firstOptionValue = options[0]?.value;
  const [value, setValue] = React.useState(initialValue || firstOptionValue);

  // Adjust selectedLabel to use the current value state
  const selectedLabel = options.find((option) => option.value === value)?.label;

  // Adjust the onChange handler to update the local state
  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between font-normal ${containerClassName}`}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 size-3 shrink-0 text-white opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-fit max-w-[400px] p-0 ${contentClassName}`}>
        <Command>
          {searchBar && (
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
          )}
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className={`max-h-[200px] overflow-auto`}>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleChange(option.value)}
                className={optionClassName}
              >
                {option.label}
                <Check
                  className={cn(
                    "ml-auto size-3",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
