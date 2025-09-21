"use client";
import { orderApiRequest } from "@/api-requests/order";
import ContactDetail from "@/app/(user)/checkout/components/contact-detail";
import OrderSummary from "@/app/(user)/checkout/components/order-summary";
import { useUserContext } from "@/app/(user)/user-provider";
import { Form } from "@/components/ui/form";
import { handleErrorApi } from "@/lib/error";
import { cartService } from "@/lib/user/cart/cart-service";
import { contactDetailsService } from "@/lib/user/contact-details/contact-detail-service";
import { CheckoutPayload } from "@/schemas/checkout.schema";
import {
  CreateOrderSchema,
  CreateOrderType,
  OrderItemType,
} from "@/schemas/order.schema";
import { useAppStore } from "@/stores/app-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null);
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const { loadCart } = useUserContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAppStore();
  const form = useForm({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: { items: [], user: user?._id },
  });

  const loadContactDetails = async () => {
    try {
      const contactDetails = await contactDetailsService.getContactDetails();
      if (contactDetails) form.setValue("contactDetails", contactDetails);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  function decodeBase64(str: string) {
    return decodeURIComponent(escape(atob(str)));
  }

  const loadData = async () => {
    try {
      const data = searchParams.get("payload");
      const rawCartItemIds = searchParams.get("cartItemIds");
      if (!data && !rawCartItemIds) {
        setError("Invalid checkout link. Missing payload or cart items.");
        return;
      }
      if (data) {
        const payload = decodeBase64(data);
        const obj: CheckoutPayload = JSON.parse(payload || "{}");
        const orderItems = [
          {
            product: obj.product,
            quantity: obj.quantity,
            attributeVariant: obj.attributes,
          } as OrderItemType,
        ];
        form.setValue("items", orderItems);
      }
      if (rawCartItemIds) {
        const cartItemIds = rawCartItemIds.split(",");
        setCartItemIds(cartItemIds);
        const cartItems = await Promise.all(
          cartItemIds.map(async (cartItemId) => {
            const cartItem = await cartService.findOne(cartItemId);
            return cartItem;
          })
        );
        const orderItems = cartItems.map(
          (cartItem) =>
            ({
              product: cartItem.product?._id,
              quantity: cartItem.quantity,
              attributeVariant: cartItem.attributeVariant,
            } as OrderItemType)
        );
        form.setValue("items", orderItems);
      }
    } catch (error) {
      setError("Something went wrong while processing your checkout link.");
      console.log(error);
    }
  };

  const onSubmit = async (data: CreateOrderType) => {
    try {
      await contactDetailsService.saveContactDetails(data.contactDetails);
      const order = (await orderApiRequest.createOrder(data)).payload;
      if (cartItemIds.length !== 0) {
        cartItemIds.forEach(async (cartItemId) => {
          try {
            await cartService.removeCartItem(cartItemId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            handleErrorApi({ error });
          }
        });
        loadCart();
      }
      router.push(`/order-success?orderId=${order.code}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    loadData();
    loadContactDetails();
  }, [searchParams]);
  return (
    <div
      className={`${
        error
          ? "h-full flex items-center justify-center"
          : "container max-w-[1200px] mx-auto px-6 py-6"
      }`}
    >
      {error && <p className="text-red-500 font-medium text-lg">{error}</p>}

      <Form {...form}>
        <form
          className="flex items-start flex-col gap-10 lg:flex-row lg:gap-20"
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data);
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <div className="w-full lg:flex-2">
            <ContactDetail orderForm={form} />
          </div>
          <div className="w-full lg:flex-1">
            <OrderSummary orderForm={form} />
          </div>
        </form>
      </Form>
    </div>
  );
}
