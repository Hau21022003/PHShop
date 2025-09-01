"use client";
import { UserProvider, useUserContext } from "@/app/(user)/user-provider";
import UserHeader from "@/app/(user)/header";
import { useAppContext } from "@/app/app-provider";
import Chat from "@/app/(user)/components/chat";
import { useState } from "react";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { scrollRef } = useUserContext();
  const { isAuthenticated } = useAppContext();
  const [isOpenChat, setIsOpenChat] = useState(false);
  const handleOpenChat = () => setIsOpenChat(true);
  const handleCloseChat = () => setIsOpenChat(false);
  return (
    <div className="h-full flex flex-col relative">
      <UserHeader handleOpenChat={handleOpenChat} />
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        {children}
      </main>
      {isAuthenticated && isOpenChat && (
        <div className="w-[100%] h-[100%] sm:w-100 sm:h-130 absolute bottom-0 sm:right-15 shadow shadow-gray-300 bg-white">
          <Chat handleCloseChat={handleCloseChat} />
        </div>
      )}
    </div>
  );
}
