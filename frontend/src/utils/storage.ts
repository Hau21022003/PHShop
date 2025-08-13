export const storage = {
  get(key: string) {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error parsing localStorage data", error);
      return null;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(key: string, value: any) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};
