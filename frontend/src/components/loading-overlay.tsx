"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let setLoading: (visible: boolean) => void;

export const showLoading = () => setLoading?.(true);
export const closeLoading = () => setLoading?.(false);

const LoadingOverlay = () => {
  const [visible, _setVisible] = useState(false);

  useEffect(() => {
    setLoading = _setVisible;
  }, []);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/50">
      <div className="w-12 h-12 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
    </div>,
    document.body
  );
};

export default LoadingOverlay;
