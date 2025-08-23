// components/ui/language-combobox.tsx
"use client";

import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface ComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
}

export function Combobox({
  value,
  onChange,
  options,
  open,
  onOpenChange,
  placeholder = "Select",
}: ComboboxProps) {
  const selected = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <p
          className={cn(
            "w-fit justify-between font-normal",
            !value && "text-muted-foreground",
            selected ? "text-black" : "text-gray-400"
          )}
        >
          {selected ? selected.label : placeholder}
        </p>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {options.map((language) => (
                <CommandItem
                  value={language.label}
                  key={language.value}
                  onSelect={() => onChange(language.value)}
                >
                  {language.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      language.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
