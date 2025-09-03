// components/SearchInput.tsx - Version không debounce
"use client";

import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    router.replace(`/admin/chat?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateSearch(searchValue);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateSearch("");
  };

  // Sync with URL changes (back/forward navigation)
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== searchValue) {
      setSearchValue(currentSearch);
    }
  }, [searchParams]);

  return (
    <div className="rounded-lg bg-gray-100 p-3 px-4 flex items-center gap-2">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full outline-none bg-transparent"
        placeholder="Search or Start of message"
      />

      <div className="flex items-center gap-2">
        {searchValue && (
          <button
            onClick={handleClearSearch}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            type="button"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        )}

        <FontAwesomeIcon
          size="lg"
          icon={faMagnifyingGlass}
          className="w-5 h-5 text-gray-500"
        />
      </div>
    </div>
  );
}
