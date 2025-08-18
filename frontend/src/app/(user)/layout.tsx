"use client";
import { UserProvider, useUserContext } from "@/app/(user)/user-provider";
import UserHeader from "@/app/(user)/header";
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

  return (
    <div className="h-full flex flex-col">
      <UserHeader />
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        {children}
      </main>
    </div>
  );
}
