"use client";
import { createContext, useContext, useRef } from "react";

type ScrollContextType = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export const ScrollContext = createContext<ScrollContextType>({
  scrollRef: { current: null },
});

export const useScrollContext = () => useContext(ScrollContext);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <ScrollContext.Provider value={{ scrollRef }}>
      {children}
    </ScrollContext.Provider>
  );
};
