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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { RegisterBody, RegisterBodyType } from "@/schemas/auth.schema";
import { useAppContext } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import authApiRequest from "@/api-requests/auth";
import { handleErrorApi } from "@/lib/error";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false)
  const { setUser } = useAppContext()
  const router = useRouter()

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    if (loading) return
    setLoading(true)
    try {
      await authApiRequest.register(values)

      // await authApiRequest.auth({
      //   sessionToken: result.payload.data.accessToken,
      //   expiresAt: result.payload.data.accessTokenExpiresAt,
      //   role: result.payload.data.account.role
      // })
      // setUser(result.payload.data.account)

      router.push('/login')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    } finally {
      setLoading(false)
    }
  }

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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="confirm password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white">
          Create account
        </Button> */}
        <Button
          disabled={loading}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          Create account
        </Button>
        <div className="mt-2 text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline underline-offset-3 text-orange-500 hover:text-orange-600 decoration-orange-300 font-medium"
          >
            Sign in
          </a>
        </div>
      </form>
    </Form>
  );
}
