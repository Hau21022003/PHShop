"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userApiRequest } from "@/api-requests/user";
import { useAppContext } from "@/app/app-provider";
import { CartItemBodyType } from "@/schemas/cart.schema";
import { cartStorage } from "@/lib/user/cart/cart-storage";
import { cartApiRequest } from "@/api-requests/cart";
import { handleErrorApi } from "@/lib/error";
import { authStorage } from "@/lib/auth/auth-storage";
import authApiRequest from "@/api-requests/auth";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const { setUser } = useAppContext();

  const syncCartOnSignup = async () => {
    try {
      const cartItems = await cartStorage.getCart();
      const cart: CartItemBodyType[] = cartItems.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ _id, createdDate, updatedDate, ...rest }) => rest
      );
      if (cartItems.length !== 0) {
        await cartApiRequest.createBatch(cart);
        cartStorage.clearCart();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };

  const load = async () => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");
    const expiresAt = url.searchParams.get("accessTokenExpiresAt");

    if (accessToken && expiresAt) {
      authStorage.saveSessionToken({ sessionToken: accessToken, expiresAt });
      try {
        const rsp = await userApiRequest.getProfile();
        const user = rsp.payload;
        await authApiRequest.auth({
          sessionToken: accessToken,
          expiresAt: expiresAt,
          role: user.role,
        });
        setUser(user);
        syncCartOnSignup();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({
          error,
        });
      }

      router.replace("/");
    } else {
      router.replace("/login");
    }
  };
  useEffect(() => {
    load();
  }, [router]);

  return <p>Log in...</p>;
}
