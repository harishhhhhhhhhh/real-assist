"use client";

import { useEffect, useState } from "react";
import { Message} from "ai/react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatProps } from "@/models/ChatProps";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";

interface ChatLayoutProps {
  defaultLayout: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  chatId: string;
  setMessages: (messages: Message[]) => void;
}

type MergedProps = ChatLayoutProps & ChatProps;

export function ChatLayout({
  defaultLayout,
  navCollapsedSize,
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  chatId,
  loadingSubmit,
  formRef,
  setMessages,
  setInput,
}: MergedProps) {
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
        <Sidebar
          chatId={chatId}
          isCollapsed={isMobile}
          setMessages={setMessages}
        />
      </ResizablePanel>
      <ResizableHandle className={cn("hidden lg:flex")} withHandle />
      <ResizablePanel
        className="h-full w-full flex justify-center"
        defaultSize={defaultLayout[1]}
        collapsedSize={navCollapsedSize}
        minSize={isMobile ? 0 : 80}
        maxSize={isMobile ? 0 : 85}
      >
        <Chat
          chatId={chatId}
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          loadingSubmit={loadingSubmit}
          error={error}
          stop={stop}
          formRef={formRef}
          isMobile={isMobile}
          setInput={setInput}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
