interface RadioItemProps {
  value: string;
  label: "Active" | "Deactive";
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioItem({
  value,
  label,
  checked,
  onChange,
}: RadioItemProps) {
  return (
    <div
      className={`
    p-3 bg-white rounded-lg space-y-2 transition-all duration-200 border-2
    ${
      checked
        ? "border-2 border-orange-500 shadow-[0_0_0_4px_#FDEDD4]"
        : "border border-gray-200"
    }
  `}
    >
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="radio"
            value={value}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
              ${
                checked
                  ? "border-orange-500 bg-white"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }
            `}
          >
            {checked && (
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 transition-all duration-200"></div>
            )}
          </div>
        </div>
        <span className="font-normal text-base text-black leading-0">
          {label}
        </span>
      </label>
      <p className="text-sm text-gray-500">
        Customers will {label == "Active" ? "be" : "not be"} able to see this
        category
      </p>
    </div>
  );
}
