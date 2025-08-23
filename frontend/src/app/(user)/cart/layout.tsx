import CartProvider from "@/app/(user)/cart/cart-provider";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
