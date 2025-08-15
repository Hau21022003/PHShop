"use client";
import { ScrollProvider, useScrollContext } from "@/app/(user)/scroll-context";
import UserHeader from "@/app/(user)/header";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollProvider>
      <LayoutContent>{children}</LayoutContent>
    </ScrollProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { scrollRef } = useScrollContext();

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
