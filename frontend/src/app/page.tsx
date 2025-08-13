"use client";
import { useAppContext } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { user, isAuthenticated, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // if (!isAuthenticated) {
    //   router.push("/login");
    //   return;
    // }

    if (user?.role === "admin") {
      router.push("/admin/product-list");
      return;
    }

    router.push("/product-list");
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
