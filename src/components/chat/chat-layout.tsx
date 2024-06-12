"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useChat } from "ai/react";
import { toast } from "sonner";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { createChatDataService, createMessageDataService, getChatDataService } from "@/services";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";

interface ChatLayoutProps {
  paramId: string;
  defaultLayout: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({
  paramId,
  defaultLayout,
  defaultCollapsed,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [chatId, setChatId] = useState<string>(paramId);
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
    key: 'real-assist',
    api: '/api/ai',
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: (message) => {
      if (chatId) {
        createMessageDataService(chatId, {
          role: 'assistant',
          content: message.content
        })
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      toast.error(`An error occurred. ${error.message}`);
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessages([...messages]);
    if (chatId) {
      createMessageDataService(chatId, {
        role: 'user',
        content: (e.target as HTMLInputElement).value
      })
    }
    handleSubmit(e);
  };

  useEffect(() => {
    if (!isLoading && !error && !chatId && messages.length) {
      const mongoMessages = messages.map(item => ({
        role: item.role,
        content: item.content,
      }));
      createChatDataService(mongoMessages)
        .then(data => setChatId(data.id));
    }
  }, [isLoading, error, chatId, messages]);

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

  const getChatData = (id: string) => {
    getChatDataService(id)
      .then(data => {
        setMessages(data.messages)
      });
  }

  useEffect(() => {
    if (chatId) {
      getChatData(chatId)
    }
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
          chatParamId={chatId}
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
