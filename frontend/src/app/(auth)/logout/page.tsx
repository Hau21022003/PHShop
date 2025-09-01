"use client";

import authApiRequest from "@/api-requests/auth";
import { useAppContext } from "@/app/app-provider";
import { authStorage } from "@/lib/auth/auth-storage";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function LogoutLogic() {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useAppContext();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    authApiRequest
      .logoutFromNextClientToNextServer(true, signal)
      .then(() => {
        // localStorage.removeItem("sessionToken"); // Nếu bạn đang lưu token
        authStorage.clear();
        setUser(null);
        router.replace(`/login?redirectFrom=${pathname}`);
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        router.replace(`/login?redirectFrom=${pathname}`);
      });

    return () => {
      controller.abort();
    };
  }, [router, pathname, setUser]);
  return <div className="text-sm text-gray-400">Logging out...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  );
}
