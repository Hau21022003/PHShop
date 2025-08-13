"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppContext } from "@/app/app-provider";

export default function UserHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAppContext();

  const menuItems = [
    { label: "All", href: "/product-list?gender=women,men" },
    { label: "Men", href: "/product-list?gender=men" },
    { label: "Women", href: "/product-list?gender=women" },
    { label: "Sale", href: "/product-list?sale=true" },
  ];

  return (
    <header className="border-b bg-white">
      <div className="container max-w-[1200px] mx-auto flex h-16 items-center justify-between px-4">
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
          <Link href={""} className="flex flex-col items-center cursor-pointer">
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <p className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-orange-500">
                45
              </p>
            </div>
          </Link>
          <Link href={""} className="flex flex-col items-center cursor-pointer">
            <div className="relative">
              <Heart className="w-6 h-6" />
              <p className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-orange-500">
                45
              </p>
            </div>
          </Link>
          <Link
            href={!isAuthenticated ? "/login" : "profile"}
            className="flex flex-col items-center cursor-pointer"
          >
            <User className="w-6 h-6" />
          </Link>
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
