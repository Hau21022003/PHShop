// "use client";
import { X } from "lucide-react";
import React, { useState } from "react";

interface FilterItemProps<T> {
  label: string;
  checked: boolean;
  value: T;
  onChange: (val: T) => void;
}
export default function FilterItem<T>({
  checked,
  label,
  value,
  onChange,
}: FilterItemProps<T>) {
  // const [tempValue, setTempValue] = useState(value);
  return (
    <div
      onClick={() => onChange(value)}
      className={`px-4 py-[4px] flex items-center justify-between cursor-pointer ${
        checked ? "bg-gray-200" : "hover:bg-gray-200"
      }`}
    >
      <span className="truncate">{label}</span>
      <button className={`${checked ? "" : "hidden"}`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
