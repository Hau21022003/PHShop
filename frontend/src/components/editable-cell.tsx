"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function EditableCell({
  value,
  onChange,
  type = "string",
}: {
  value: string;
  onChange: (val: string) => void;
  type: "string" | "number";
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setEditing(false);
    onChange(tempValue);
  };

  return editing ? (
    <Input
      type={type == "number" ? "number" : ""}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer hover:underline"
    >
      {value || "—"}
    </span>
  );
}
