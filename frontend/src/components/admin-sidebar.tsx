"use client";

import Link from "next/link";
import {
  PanelLeftClose,
  MessageCircleQuestion,
  LogOut,
  PanelRightClose,
  ChartColumnDecreasing,
  Users,
} from "lucide-react";
import Image from "next/image";
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
        ${
          active
            ? "bg-[#35363f] text-white"
            : "hover:bg-[#2c2d35] text-gray-200"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${active ? "text-orange-400" : "text-gray-400"}`}>
          {icon}
        </div>
        {!isCollapsed && <span className="font-medium">{label}</span>}
      </div>
    </Link>
  );
};

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`h-full ${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#24252d] text-white flex flex-col p-4 transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-4 mt-2 mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-orange-400 to-orange-600 p-1.5 rounded-xl shadow-[inset_0_0_12px_rgba(255,115,0,0.6)] text-white">
              <Image src="/logo-white.svg" alt="Logo" width={32} height={32} />
            </div>
            {/* <h1 className="text-xl font-medium tracking-wider">Chatbot</h1> */}
            {!isCollapsed && (
              <h1 className="text-xl font-medium tracking-wider">Admin</h1>
            )}
          </div>
        )}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          {isCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
        </div>
      </div>
      <div
        className="flex-1 flex flex-col justify-between overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Menu Items */}
        <nav className="flex flex-col gap-3">
          <SidebarItem
            icon={<ChartColumnDecreasing />}
            label="Dashboard"
            url="/admin/dashboard"
            active={pathname == "/admin/dashboard"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<MessageCircleQuestion />}
            label="Help Center"
            url="/admin/help"
            active={pathname === "/admin/help"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Users />}
            label="User Management"
            url="/admin/user-management"
            active={pathname === "/admin/user-management"}
            isCollapsed={isCollapsed}
          />
          
        </nav>
      </div>

      <div className="space-y-4 pt-4">
        {/* Divider */}
        <div className="border-t border-gray-600" />
        {/* Log out */}
        <a
          href="/logout"
          className="flex items-center justify-between gap-2 hover:bg-[#2c2d35] text-gray-200 py-2 px-3 rounded-lg transition cursor-pointer"
        >
          {!isCollapsed && <span className="font-medium">Log out</span>}
          <LogOut />
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
