"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { Types } from 'mongoose';

import { MongoMessage } from "@/models";
import { ChatBottombar } from "@/components/chat/chat-bottombar";
import { ChatTopbar } from "@/components/chat/chat-topbar";
import { ChatList } from "@/components/chat/chat-list";
import { createChatDataService, createMessageDataService, getChatDataService } from "@/services";

export default function ChatPage({ params }: { params: { id: string } }) {
  const authContext = useAuth();
  const router = useRouter();
  const chatParamId = params.id?.[0];
  const [chatId, setChatId] = useState<string>(chatParamId);
  const formRef = useRef<HTMLFormElement>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [isFinished, setFinished] = useState(false);
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
    headers: {
      'Authorization': `Bearer ${authContext.user?.access_token}`,
    },
    generateId: () => new Types.ObjectId().toString(),
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: async (message) => {
      setFinished(true);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      toast.error(`An error occurred. ${error.message}`);
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setFinished(false);
    e.preventDefault();
    setLoadingSubmit(true);
    setMessages([...messages]);
    if (chatId) {
      createMessageDataService(chatId, {
        id: new Types.ObjectId().toString(),
        role: 'user',
        content: input
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
        .then(data => {
          window.dispatchEvent(new Event("storage"));
          setChatId(data.id);
        });

    }
  }, [isLoading, chatId, error, messages]);

  useEffect(() => {
    if (chatId) {
      setChatLoading(true);
      getChatDataService(chatId)
        .then(data => setMessages(data.messages))
        .catch(() => router.replace('/'))
        .finally(() => setChatLoading(false));
    }
  }, []);

  useEffect(() => {
    if (isFinished && !error) {
      if (chatId) {
        const currentMessage = messages[messages.length - 1];
        const previousMessageId = messages[messages.length - 2].id;
        createMessageDataService(chatId, {
          id: currentMessage.id,
          role: currentMessage.role,
          content: currentMessage.content,
          annotations: currentMessage.annotations,
          questionId: previousMessageId,
        })
      }
    }
  }, [isFinished]);

  return (
    <div className="flex flex-col justify-between w-full max-w-3xl h-full ">
      <ChatTopbar />

      <ChatList
        messages={messages as MongoMessage[]}
        isLoading={isLoading}
        chatLoading={chatLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        formRef={formRef}
        setMessages={setMessages}
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
