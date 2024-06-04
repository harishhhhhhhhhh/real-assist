"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { ChatRequestOptions } from "ai";
import { Message, useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { OLLAMA_MODEL } from "@/lib/constants";
import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/ui/loader";

interface MainProps {
  params?: {
    id?: string;
  }
}

export default function Main({
  params = {}
}: MainProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
    setInput,
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
  const authContext = useAuth();
  const [chatId, setChatId] = useState<string>(params.id || '');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);

    setMessages([...messages]);

    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      options: {
        body: {
          selectedModel: OLLAMA_MODEL,
        },
      },
    };

    handleSubmit(e, requestOptions);
  };

  const checkOidcLoginState = () => {
    if (!authContext.isAuthenticated) {
      authContext.signinRedirect({
        state: window.location.href
      });
    }
  }

  /* useEffect(() => {
    if (messages.length < 1) {
      // Generate a random id for the chat
      console.log("Generating chat id");
      const id = uuidv4();
      setChatId(id);
    }
  }, [messages]); */

  // When starting a new chat, append the messages to the local storage
  const apicall = async () => {
    const res = await fetch('http://localhost:3000/api/db', {
      method: 'GET',
    });
  }
  useEffect(() => {
    if (!isLoading && !error && messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
    // apicall();
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
    if (!authContext.isLoading) {
      checkOidcLoginState();
    }
  }, [authContext]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      {authContext.isLoading ?
        <Loader /> :
        <ChatLayout
          chatId=""
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          loadingSubmit={loadingSubmit}
          error={error}
          stop={stop}
          formRef={formRef}
          navCollapsedSize={10}
          defaultLayout={[20, 80]}
          setMessages={setMessages}
          setInput={setInput}
        />
      }
    </main>
  );
}
