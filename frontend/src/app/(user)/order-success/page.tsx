"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const particles = Array.from({ length: 15 });

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    const orderId = searchParams.get("orderId") || "";
    setOrderId(orderId);
  }, [searchParams]);

  return (
    <div className="h-full flex flex-col gap-2 items-center justify-center relative">
      <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-orange-500 relative overflow-visible">
        <Check className="w-12 h-12 text-orange-500" />

        {particles.map((_, i) => {
          const size = Math.random() * 12 + 6;

          // random trong vòng tròn nhỏ (bán kính 20)
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 40; // bán kính nhỏ gần tâm
          const startX = Math.cos(angle) * r;
          const startY = Math.sin(angle) * r;

          // random đích bay ra xa hơn
          const endX = (Math.random() - 0.5) * 220;
          const endY = (Math.random() - 0.5) * 220;

          return (
            <motion.span
              key={i}
              className="absolute bg-orange-500 rounded-full"
              style={{ width: size, height: size }}
              initial={{ x: startX, y: startY, opacity: 1, scale: 0.8 }}
              animate={{ x: endX, y: endY, opacity: 0, scale: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.1,
              }}
            />
          );
        })}
      </div>

      <p className="mt-4 text-2xl font-medium">Thank you for ordering</p>
      <div className="text-lg space-y-2 text-gray-400 flex flex-col items-center">
        <p>We have received your order will ship in 5 - 7 business days</p>
        <p>Your order number is {orderId}</p>
      </div>

      <Link
        href="/product-list"
        className="mt-4 w-full flex flex-col items-center px-4"
      >
        <p className="w-full sm:w-80 p-2 text-center bg-black text-white uppercase font-medium">
          Continue shopping
        </p>
      </Link>
    </div>
  );
}
