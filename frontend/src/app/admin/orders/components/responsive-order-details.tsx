"use client";
import OrderDetails from "@/app/admin/orders/components/order-details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderResType } from "@/schemas/order.schema";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ResponsiveOrderDetailsProps {
  order?: OrderResType;
  open: boolean;
  onClose: () => void;
  loadOrders: () => void;
}
export default function ResponsiveOrderDetails({
  loadOrders,
  open,
  onClose,
  order,
}: ResponsiveOrderDetailsProps) {
  const [is2xl, setIs2xl] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1536 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIs2xl(window.innerWidth >= 1536);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!open) return null;

  return is2xl ? (
    <div className="w-[700px] space-y-4 py-4 px-6 border-gray-300 border-2 rounded-sm bg-gray-50">
      <div className="flex justify-between items-center">
        <p className="uppercase font-medium">Order details</p>
        <X onClick={onClose} className="w-6 h-6 cursor-pointer" />
      </div>
      <div
        className="border-t-2 border-dashed border-black"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, black 0, black 6px, transparent 6px, transparent 12px) 2",
        }}
      ></div>
      <OrderDetails order={order} onClose={onClose} loadOrders={loadOrders} />
    </div>
  ) : (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle className="uppercase">Order details</DialogTitle>
        </DialogHeader>
        <OrderDetails order={order} onClose={onClose} loadOrders={loadOrders} />
      </DialogContent>
    </Dialog>
  );
}
