"use client";
import Link from "next/link";
import {
  LogOut,
  Package,
  ClipboardList,
  ShoppingBag,
  MessageCircleMore,
  StarHalf,
  Car,
  Grid2x2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SaveFreeShipping from "@/app/admin/components/save-free-shipping";
import { chatApiRequest } from "@/api-requests/chat";
import { socketService } from "@/lib/socket";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSaveFreeShipping, setOpenSaveFreeShipping] = useState(false);

  const onOpenFreeShipping = () => setOpenSaveFreeShipping(true);
  const onCloseFreeShipping = () => setOpenSaveFreeShipping(false);

  const MainMenuOptions = [
    {
      icon: <Grid2x2 className="w-6 h-6" />,
      label: "Overview",
      url: "/admin/overview",
      active: pathname === "/admin/overview",
    },
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
      label: "Orders",
      url: "/admin/orders",
      active: pathname == "/admin/orders",
    },
  ];

  const GeneralMenUOptions = [
    {
      icon: <MessageCircleMore className="w-6 h-6" />,
      label: "Customer Care",
      url: "/admin/chat",
      active: pathname == "/admin/chat",
    },
    {
      icon: <StarHalf className="w-6 h-6" />,
      label: "Feedback",
      url: "/admin/review",
      active: pathname == "/admin/review",
    },
  ];

  const [countUnreadMessages, setCountUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchCountUnreadMessages = async () => {
      try {
        const count = (await chatApiRequest.countUserUnreadMessages()).payload
          .count;
        setCountUnreadMessages(count);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCountUnreadMessages();
    const socket = socketService.connect();

    socket.on("receive_message", () => {
      fetchCountUnreadMessages();
    });

    return () => {
      socketService.disconnect();
    };
    // Ham dọn dẹp
  }, []);

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
              <Link href={`/product-list`}>
                <h1 className="cursor-pointer text-xl font-medium tracking-wider ">
                  Anna Shop
                </h1>
              </Link>
            )}
          </div>
        )}
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
              <Link
                key={item.label}
                href={item.url}
                className={`flex items-center outline-none justify-between py-2 px-3 rounded-lg transition cursor-pointer ${
                  item.active
                    ? "bg-white text-black"
                    : "cursor-pointer text-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      item.active ? "text-blue-400" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium leading-none tracking-wide">
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
          <p className="text-sm text-gray-500 mt-6">General</p>
          <nav className="flex flex-col gap-3">
            {GeneralMenUOptions.map((item) => (
              <Link
                key={item.label}
                href={item.url}
                className={`flex items-center outline-none justify-between py-2 px-3 rounded-lg transition cursor-pointer ${
                  item.active
                    ? "bg-white text-black"
                    : "cursor-pointer text-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      item.active ? "text-blue-400" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium leading-none tracking-wide">
                    {item.label}
                  </span>
                  {item.url.includes("chat") && countUnreadMessages !== 0 && (
                    <p className="p-1 px-2 text-xs font-medium leading-none bg-black text-white rounded-md">
                      {countUnreadMessages < 100 ? countUnreadMessages : "99+"}
                    </p>
                  )}
                </div>
              </Link>
            ))}
            <button
              onClick={onOpenFreeShipping}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-500">
                  <Car className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-500 leading-none tracking-wide">
                  Free Ship
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>
      <SaveFreeShipping
        open={openSaveFreeShipping}
        onClose={onCloseFreeShipping}
      />

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
