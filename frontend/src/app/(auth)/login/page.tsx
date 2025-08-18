/* eslint-disable @next/next/no-img-element */
import { LoginForm } from "@/app/(auth)/login/components/login-form";
import { Raleway } from "next/font/google";
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400"],
});

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch h-full">
          {/* Left: Login Form */}
          <div className="w-full md:w-1/2 px-6 md:px-12 py-8 space-y-2">
            {/* <Image src="/logo.svg" alt="Logo" width={40} height={40} /> */}
            <p className={`${raleway.className} text-2xl`}>Anna Shop</p>
            <h3 className="text-2xl font-bold">Welcome Back</h3>
            <p className="text-gray-600 mb-8">
              Please enter your credentials to continue
            </p>
            <LoginForm />
          </div>

          {/* Right: Image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img
              src="./bg-login-page.jpg"
              alt="bg-login"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
