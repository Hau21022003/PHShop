"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/error";
import authApiRequest from "@/api-requests/auth";
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const load = async () => {
    if (token) {
      try {
        await authApiRequest.verifyEmail(token);
        router.replace("/login");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    } else {
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === "verifying" && <p>Verifying your email...</p>}
      {status === "success" && <p>Email verified! Redirecting...</p>}
      {status === "error" && (
        <p>Verification failed. Please request a new link.</p>
      )}
    </div>
  );
}
