"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { toast } from "sonner";

import ChatBottombar from "@/components/chat/chat-bottombar";
import ChatTopbar from "@/components/chat/chat-topbar";
import ChatList from "@/components/chat/chat-list";
import { createChatDataService, createMessageDataService, getChatDataService } from "@/services";

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const chatParamId = params.id?.[0];
  //const [chatId, setChatId] = useState<string>(chatParamId);
  const formRef = useRef<HTMLFormElement>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const {
    messages,
    input,
    isLoading,
    error,
    stop,
    handleSubmit,
    handleInputChange,
    setMessages,
  } = useChat({
    key: 'real-assist',
    api: '/api/ai',
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: (message) => {
      if (chatParamId) {
        createMessageDataService(chatParamId, {
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
    if (chatParamId) {
      createMessageDataService(chatParamId, {
        role: 'user',
        content: input
      })
    }
    handleSubmit(e);
  };

  useEffect(() => {
    if (!isLoading && !error && !chatParamId && messages.length) {
      const mongoMessages = messages.map(item => ({
        role: item.role,
        content: item.content,
      }));
      createChatDataService(mongoMessages)
        .then(data => {
          window.dispatchEvent(new Event("storage"));
          router.push(`/chat/${data.id}`);
      });
      
    }
  }, [isLoading, chatParamId, error, messages]);

  useEffect(() => {
    if (chatParamId) {
      setChatLoading(true);
      getChatDataService(chatParamId)
        .then(data => setMessages(data.messages))
        .catch(() => router.replace('/'))
        .finally(() => setChatLoading(false));
    }
  }, []);

  return (
    <div className="flex flex-col justify-between w-full max-w-3xl h-full ">
      <ChatTopbar />

      <ChatList
        messages={messages}
        isLoading={isLoading}
        chatLoading={chatLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        formRef={formRef}
        handleInputChange={handleInputChange}
      />

      <ChatBottombar
        input={input}
        isLoading={isLoading}
        formRef={formRef}
        handleStop={stop}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
      />
    </div>
  );
}
