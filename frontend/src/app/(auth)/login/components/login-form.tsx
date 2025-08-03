"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginBody, LoginBodyType } from "@/schemas/auth.schema";
import Image from "next/image";
import authApiRequest from "@/api-requests/auth";
import { toast } from "sonner";
import { useAppContext } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/error";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.login(values);

      await authApiRequest.auth({
        sessionToken: result.payload.data.accessToken,
        expiresAt: result.payload.data.accessTokenExpiresAt,
        role: result.payload.data.account.role,
      });
      setUser(result.payload.data.account);
      router.push("/");
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  }

  const forgotPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Error", { description: "Please enter your email" });
      return;
    }
    try {
      await authApiRequest.forgotPassword(email);
      toast.success("Email sent", {
        description: "Please check your email to reset your password",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <p
                  onClick={() => {
                    forgotPassword();
                  }}
                  className="text-orange-500 cursor-pointer ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </p>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          Sign in
        </Button>
        <div className="my-2 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            OR
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/google`;
          }}
        >
          <Image
            src="/google-icon.png"
            alt="Google icon"
            width={20}
            height={20}
          />
          Sign in with Google
        </Button>
        <div className="mt-2 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="underline underline-offset-3 text-orange-500 hover:text-orange-600 decoration-orange-300 font-medium"
          >
            Sign up
          </a>
        </div>
      </form>
    </Form>
  );
}
