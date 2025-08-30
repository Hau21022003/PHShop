"use client";
import { useState, useRef, useEffect } from "react";

export default function TextCollapse({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        // Kiểm tra nếu content bị cắt bởi line-clamp-3
        const element = textRef.current;
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    checkOverflow();
    // Kiểm tra lại khi resize window
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div className="">
      <p
        ref={textRef}
        className={`text-base transition-all duration-300 break-words ${
          expanded ? "line-clamp-none" : "line-clamp-2"
        }`}
      >
        {text}
      </p>
      {isOverflowing && (
        <button
          className="text-blue-500 underline underline-offset-4 text-base cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide" : "View more"}
        </button>
      )}
    </div>
  );
}
