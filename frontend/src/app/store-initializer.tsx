"use client";

import { authStorage } from "@/lib/auth/auth-storage";
import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";

export default function StoreInitializer() {
  const { setUser, setIsLoading } = useAppStore();

  useEffect(() => {
    try {
      const _user = authStorage.getUser();
      setUser(_user || null);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return null;
}
