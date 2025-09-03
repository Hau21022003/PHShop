export const generateColor = (text?: string) => {
  if (!text) return "bg-gray-200";

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-orange-200",
    "bg-teal-200",
    "bg-cyan-200",
    "bg-lime-200",
    "bg-amber-200",
    "bg-emerald-200",
    "bg-violet-200",
    "bg-fuchsia-200",
    "bg-rose-200",
  ];

  return colors[Math.abs(hash) % colors.length];
};