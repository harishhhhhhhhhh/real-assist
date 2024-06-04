"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
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
  defaultCollapsed,
  navCollapsedSize,
}: ChatLayoutProps) {
  const authContext = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const {
    messages,
    input,
    isLoading,
    error,
    setMessages,
    stop,
    handleSubmit,
    handleInputChange,
  } = useChat({
    api: 'api/chat',
    headers: {
      Authorization: `Bearer ${authContext.user?.access_token}`
    },
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      console.log(error);
      toast.error(`An error occurred. ${error.message}`);
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessages([...messages]);
    handleSubmit(e);
  };

  // When starting a new chat, append the messages to the local storage
  useEffect(() => {
    if (!isLoading && !error && messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [messages, chatId, isLoading, error]);

  useEffect(() => {
    if (chatId) {
      const item = localStorage.getItem(`chat_${chatId}`);
      if (item) {
        setMessages(JSON.parse(item));
      }
    }
  }, []);

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
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed
            ? "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
            : "hidden md:block"
        )}
      >
        <Sidebar
          chatId={chatId}
          isCollapsed={isCollapsed || isMobile}
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
          isLoading={isLoading}
          loadingSubmit={loadingSubmit}
          input={input}
          error={error}
          setMessages={setMessages}
          handleStop={stop}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
