import { ChangeEvent, FormEvent, useRef } from "react";
import { Message } from "ai";

import ChatBottombar from "./chat-bottombar";
import ChatTopbar from "./chat-topbar";
import ChatList from "./chat-list";

export interface ChatProps {
  chatId: string;
  messages: Message[];
  isLoading: boolean;
  loadingSubmit: boolean;
  input: string;
  error: undefined | Error;
  setMessages: (messages: Message[]) => void;
  handleStop: () => void;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function Chat({ 
  chatId,
  messages,
  isLoading,
  loadingSubmit,
  input,
  error,
  setMessages,
  handleStop,
  handleInputChange,
  handleSubmit,
}: ChatProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col justify-between w-full max-w-3xl h-full ">
      <ChatTopbar
        chatId={chatId}
        setMessages={setMessages}
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
        handleStop={handleStop}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
