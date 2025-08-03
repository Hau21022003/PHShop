"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

let setImage: (src: string | null) => void;

export const showImage = (src: string) => setImage?.(src);
export const closeImage = () => setImage?.(null);

const ImageViewer = () => {
  const [src, _setSrc] = useState<string | null>(null);
  useEffect(() => {
    setImage = _setSrc;
  }, []);

  if (!src) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center"
      onClick={() => _setSrc(null)}
    >
      <img
        src={src}
        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
      />
    </div>,
    document.body
  );
};

export default ImageViewer;
