"use client";
import AdminSidebar from "@/app/admin/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-full flex flex-col xl:flex-row">
      {/* Sidebar bên trái */}
      <div className="h-full hidden xl:block">
        <AdminSidebar />
      </div>

      <div className="block xl:hidden p-2 bg-black">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <div className="cursor-pointer">
              <Menu className="h-6 w-6 text-white" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="h-full overflow-y-auto">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Nội dung chính */}
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
