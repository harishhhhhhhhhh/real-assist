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
import { createConversationDataService, getChatDataService } from "@/services";
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
  const authContext = useAuth();
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
    api: '/api/ai',
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: (message) =>  {
      createConversationDataService(chatId, {
        role: 'assistant',
        content: message.content
      })
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
    createConversationDataService(chatId, {
      role: 'user',
      content: (e.target as HTMLInputElement).value
    })
    handleSubmit(e);
  };

  // When starting a new chat, append the messages to the local storage
  /* useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [chatId, isLoading, error]); */

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

  /* useEffect(() => {
    if (!chatId && messages.length < 1) {
      const id = uuidv4();
      setChatId(id);
    }
  }, [messages]); */


  const getChatData = (id: string) => {
    getChatDataService(id)
      .then(data => setMessages(data.conversation));
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
