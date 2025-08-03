export const generateColor = (text?: string) => {
  if (!text) return "bg-gray-500";

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "bg-red-500 border-red-500",
    "bg-blue-500 border-blue-500",
    "bg-green-500 border-green-500",
    "bg-yellow-500 border-yellow-500",
    "bg-purple-500 border-purple-500",
    "bg-pink-500 border-pink-500",
    "bg-indigo-500 border-indigo-500",
    "bg-orange-500 border-orange-500",
    "bg-teal-500 border-teal-500",
    "bg-cyan-500 border-cyan-500",
    "bg-lime-500 border-lime-500",
    "bg-amber-500 border-amber-500",
    "bg-emerald-500 border-emerald-500",
    "bg-violet-500 border-violet-500",
    "bg-fuchsia-500 border-fuchsia-500",
    "bg-rose-500 border-rose-500",
  ];

  return colors[Math.abs(hash) % colors.length];
};

export const getTextColor = (text?: string): string => {
  const bgClass = generateColor(text);
  // Tách tên màu từ lớp bg (vd: "bg-red-500" → "red")
  const match = bgClass.match(/bg-([a-z]+)-\d+/);
  const colorName = match?.[1];

  // Một số màu nền tối nên dùng chữ trắng
  const darkColors = new Set([
    "red",
    "blue",
    "green",
    "purple",
    "pink",
    "indigo",
    "orange",
    "teal",
    "cyan",
    "violet",
    "fuchsia",
    "rose",
  ]);

  return colorName && darkColors.has(colorName) ? "text-white" : "text-black";
};

// Hàm lấy initials từ văn bản
export const getInitials = (text?: string) => {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
