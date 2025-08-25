export function downloadFile(blob: Blob, filename: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn("downloadFile is only available in the browser");
    return;
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
