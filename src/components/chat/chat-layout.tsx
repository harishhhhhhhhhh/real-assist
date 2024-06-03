"use client";

import { useEffect, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
//import { Sidebar } from "../sidebar";
import { Chat } from "./chat";

interface ChatLayoutProps {
  chatId: string;
  defaultLayout: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({
  chatId,
  defaultLayout,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-screen items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 15}
        maxSize={isMobile ? 0 : 20}
      >
        {/* <Sidebar
          chatId={chatId}
          isCollapsed={isMobile}
          setMessages={setMessages}
        /> */}
      </ResizablePanel>
      <ResizableHandle className={cn("hidden lg:flex")} withHandle />
      <ResizablePanel
        className="h-full w-full flex justify-center"
        defaultSize={defaultLayout[1]}
        collapsedSize={navCollapsedSize}
        minSize={isMobile ? 0 : 80}
        maxSize={isMobile ? 0 : 85}
      >
        <Chat chatId={chatId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
