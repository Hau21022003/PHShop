"use client";

import Link from "next/link";
import {
  PanelLeftClose,
  LogOut,
  PanelRightClose,
  Package,
  ClipboardList,
  PackageSearch,
  Ticket,
  ShoppingBag,
  MessageCircleMore,
  StarHalf,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SidebarItem = ({
  icon,
  label,
  url,
  active = false,
  isCollapsed = false,
}: {
  icon: React.ReactNode;
  label: string;
  url: string;
  active?: boolean;
  isCollapsed?: boolean;
}) => {
  return (
    <Link
      href={url}
      className={`flex items-center justify-between py-2 px-3 rounded-lg transition cursor-pointer
        ${active ? "bg-white text-black" : "cursor-pointer text-gray-500"}`}
    >
      <div className="flex items-center gap-3">
        <div className={`${active ? "text-blue-400" : "text-gray-500"}`}>
          {icon}
        </div>
        {!isCollapsed && (
          <span className="font-medium leading-none tracking-wide">
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const MainMenuOptions = [
    {
      icon: <Package className="w-6 h-6" />,
      label: "Product",
      url: "/admin/product-list",
      active: pathname.includes("product"),
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      label: "Category",
      url: "/admin/category",
      active: pathname == "/admin/category",
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: "Order",
      url: "/admin/order",
      active: pathname == "/admin/order",
    },
  ];

  const GeneralMenUOptions = [
    {
      icon: <MessageCircleMore className="w-6 h-6" />,
      label: "Message",
      url: "/admin/message",
      active: pathname == "/admin/message",
    },
    {
      icon: <StarHalf className="w-6 h-6" />,
      label: "Feedback",
      url: "/admin/feedback",
      active: pathname == "/admin/feedback",
    },
  ];

  return (
    <aside
      className={`lg:h-full w-full ${
        isCollapsed ? "w-20" : "lg:w-64"
      } lg:bg-gray-100 text-black lg:flex lg:flex-col p-4 transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-4 mt-2 mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            {!isCollapsed && (
              <h1 className="text-xl font-medium tracking-wider">Anna Shop</h1>
            )}
          </div>
        )}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:block hidden px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          {isCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
        </div>
      </div>
      <div
        className="flex-1 flex flex-col justify-between lg:overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Menu Items */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Main menu</p>
          <nav className="flex flex-col gap-3">
            {MainMenuOptions.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                url={item.url}
                active={item.active}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
          <p className="text-sm text-gray-500 mt-6">General</p>
          <nav className="flex flex-col gap-3">
            {GeneralMenUOptions.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                url={item.url}
                active={item.active}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {/* Divider */}
        <div className="border-t border-gray-600" />
        {/* Log out */}
        <a
          href="/logout"
          className="flex items-center justify-between gap-2 text-gray-500 py-2 px-3 rounded-lg transition cursor-pointer"
        >
          {!isCollapsed && <span className="font-medium">Log out</span>}
          <LogOut />
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
