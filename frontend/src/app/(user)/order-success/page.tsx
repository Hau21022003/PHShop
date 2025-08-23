"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

import { motion } from "framer-motion";

const particles = Array.from({ length: 15 });

export default function OrderSuccessPage() {
  return (
    // <div className="h-full flex flex-col gap-6 items-center justify-center">
    //   <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-orange-500">
    //     <Check className="w-12 h-12 text-orange-500" />
    //   </div>
    //   <p className="text-2xl font-medium">Thank you for ordering</p>
    //   <Link
    //     href={`/product-list`}
    //     className="w-full flex flex-col items-center"
    //   >
    //     <p className="w-full sm:w-80 p-2 text-center bg-black text-white uppercase font-medium">
    //       Continue shopping
    //     </p>
    //   </Link>
    // </div>

    <div className="h-full flex flex-col gap-6 items-center justify-center relative">
      <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-orange-500 relative overflow-visible">
        <Check className="w-12 h-12 text-orange-500" />

        {particles.map((_, i) => {
          const width = Math.random() * 16 + 6;
          return (
            <motion.span
              key={i}
              className="absolute w-2 h-2 bg-orange-500 rounded-full"
              style={{
                width: width,
                height: width,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0.8,
              }}
              animate={{
                x: (Math.random() - 0.5) * 180, // bay ra ngoài
                y: (Math.random() - 0.5) * 180,
                opacity: 0,
                scale: 0,
              }}
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

      <p className="text-2xl font-medium">Thank you for ordering</p>

      <Link
        href="/product-list"
        className="w-full flex flex-col items-center px-4"
      >
        <p className="w-full sm:w-80 p-2 text-center bg-black text-white uppercase font-medium">
          Continue shopping
        </p>
      </Link>
    </div>
  );
}
