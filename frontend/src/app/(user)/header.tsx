/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Package, ShoppingBag, User } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppContext } from "@/app/app-provider";
import { Gender } from "@/schemas/product.schema";
import { useUserContext } from "@/app/(user)/user-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function UserHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAppContext();
  const { cart } = useUserContext();

  const menuItems = [
    { label: "All", href: "/product-list" },
    { label: "Men", href: `/product-list?gender=${Gender.MALE}` },
    { label: "Women", href: `/product-list?gender=${Gender.FEMALE}` },
    { label: "Sale", href: "/product-list?sale=true" },
  ];

  return (
    <header className="border-b bg-white">
      <div className="container max-w-[1200px] mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Anna Shop
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center gap-6">
          {/* Cart */}
          <HoverCard>
            <HoverCardTrigger>
              <Link
                href={"/cart"}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  {cart.length !== 0 && (
                    <p className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-orange-500">
                      {cart.length}
                    </p>
                  )}
                </div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-96 p-0 overflow-hidden">
              <div>
                {cart && cart.length > 0 ? (
                  <div>
                    {cart.slice(0, 5).map((cartItem, idx) => (
                      <Link
                        key={idx}
                        href={`/product-detail/${cartItem.product?._id}`}
                        className="p-3 flex gap-3 items-start hover:bg-gray-100"
                      >
                        <img
                          src={cartItem.snapshot.image}
                          alt=""
                          className="w-14 h-14 object-cover"
                        />
                        <p className="flex-1 text truncate">
                          {cartItem.snapshot.name}
                        </p>
                        <p className="text-orange-500 ml-4">
                          {cartItem.snapshot.price.toLocaleString("vi-VN")}đ
                        </p>
                      </Link>
                    ))}
                    <div className="p-3 flex items-center justify-between">
                      <p className="text-gray-400">{cart.length} items</p>
                      <Link
                        href={`/cart`}
                        className="cursor-pointer p-1 px-3 bg-black text-white"
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                ) : (
                  // <p className="p-3 text-gray-500">Giỏ hàng trống</p>
                  <div className="py-14 flex flex-col items-center gap-2">
                    <FontAwesomeIcon
                      icon={faShoppingBag}
                      size="4x"
                      className="text-black w-14 h-14"
                    />
                    <p className="text-lg font-medium">Empty Cart</p>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
          <Link
            href="/search-order"
            className="flex flex-col items-center cursor-pointer"
            title="Search Order"
          >
            <Package className="w-6 h-6" />
          </Link>

          {/* Profile icon */}
          {!isAuthenticated && (
            <Link
              href="/login"
              className="flex flex-col items-center cursor-pointer"
            >
              <User className="w-6 h-6" />
            </Link>
          )}

          {isAuthenticated && (
            <Popover>
              <PopoverTrigger>
                <div className="flex flex-col items-center cursor-pointer">
                  <User className="w-6 h-6" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-44 px-0 py-0">
                <div className="flex flex-col">
                  <Link
                    className="w-full p-3 py-3 hover:bg-gray-100"
                    href={`/orders`}
                  >
                    My Orders
                  </Link>
                  <Link
                    className="w-full p-3 py-3 hover:bg-gray-100"
                    href={`/logout`}
                  >
                    Logout
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">Menu</span>
                </div>
                <nav className="flex flex-col gap-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
