import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { OLLAMA_MODEL } from "@/lib/constants";
import ChatBottombar from "./chat-bottombar";
import ChatTopbar from "./chat-topbar";
import ChatList from "./chat-list";

export interface ChatProps {
  chatId: string;
}

export function Chat({ chatId }: ChatProps) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onError: () => {
      setLoadingSubmit(false);
      toast.error("An error occurred. Please try again.");
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);

    setMessages([...messages]);

    handleSubmit(e);
  };

  /* useEffect(() => {
    if (messages.length < 1) {
      // Generate a random id for the chat
      console.log("Generating chat id");
      const id = uuidv4();
      setChatId(id);
    }
  }, [messages]); */

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

  return (
    <div className="flex flex-col justify-between w-full max-w-3xl h-full ">
      <ChatTopbar
        chatId={chatId}
        messages={messages}
      />

      <ChatList
        messages={messages}
        isLoading={isLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        formRef={formRef}
        handleInputChange={handleInputChange}
      />

      <ChatBottombar
        input={input}
        isLoading={isLoading}
        formRef={formRef}
        stop={stop}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
      />
    </div>
  );
}
