import { useRef, useEffect, useState, ChangeEvent, RefObject } from "react";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { INITIAL_QUESTIONS } from "@/utils/initial-questions";
import { useUserData } from "@/app/hooks/useUserData";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import CodeDisplayBlock from "../code-display-block";

export interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
  loadingSubmit: boolean;
  formRef: RefObject<HTMLFormElement>;
  error: undefined | Error;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function ChatList({
  messages,
  handleInputChange,
  isLoading,
  loadingSubmit,
  formRef,
}: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { userName } = useUserData();
  const [initialQuestions, setInitialQuestions] = useState<Message[]>([]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setInitialQuestions(
        INITIAL_QUESTIONS
          .map((message) => {
            return {
              id: "1",
              role: "user",
              content: message.content,
            };
          })
      );
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onClickQuestion = (value: string, e: MouseEvent) => {
    e.preventDefault();

    handleInputChange({
      target: { value },
    } as ChangeEvent<HTMLTextAreaElement>);

    setTimeout(() => {
      formRef.current?.dispatchEvent(
        new Event("submit", {
          cancelable: true,
          bubbles: true,
        })
      );
    }, 1);
  };

  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="relative flex flex-col gap-4 items-center justify-center w-full h-full">
          <div></div>
          <div className="flex flex-col gap-4 items-center">
            <Image
              src="/realpage-logo.png"
              alt="AI"
              width={60}
              height={60}
              className="object-contain"
            />
            <p className="text-center text-lg text-muted-foreground">
              How can I help you today?
            </p>
          </div>

          <div className="absolute bottom-0 w-full px-4 sm:max-w-3xl grid gap-2 sm:grid-cols-2 sm:gap-4 text-sm">
            {initialQuestions.map((message) => {
              const delay = Math.random() * 0.25;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1, delay },
                    scale: { duration: 0.1, delay },
                    y: { type: "spring", stiffness: 100, damping: 10, delay },
                  }}
                  key={message.content}
                >
                  <Button
                    key={message.content}
                    type="button"
                    variant="outline"
                    className="sm:text-start px-4 py-8 flex w-full justify-center sm:justify-start items-center text-sm whitespace-pre-wrap"
                    onClick={(e) => onClickQuestion(message.content, e)}
                  >
                    {message.content}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="scroller"
      className="w-full overflow-y-scroll overflow-x-hidden h-full justify-end"
    >
      <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
            transition={{
              opacity: { duration: 0.1 },
              layout: {
                type: "spring",
                bounce: 0.3,
                duration: messages.indexOf(message) * 0.05 + 0.2,
              },
            }}
            className={cn(
              "flex flex-col gap-2 p-4 whitespace-pre-wrap",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div className="flex gap-3 items-center">
              {message.role === "user" && (
                <div className="flex items-end gap-3">
                  <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                    {message.content}
                  </span>
                  <Avatar className="flex justify-start items-center overflow-hidden">
                    <AvatarImage
                      src="/"
                      alt="user"
                      width={6}
                      height={6}
                      className="object-contain"
                    />
                    <AvatarFallback>
                      {userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              {message.role === "assistant" && (
                <div className="flex items-end gap-2">
                  <Avatar className="flex justify-start items-center">
                    <AvatarImage
                      src="/realpage-logo.png"
                      alt="AI"
                      width={6}
                      height={6}
                      className="object-contain"
                    />
                  </Avatar>
                  <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                    {/* Check if the message content contains a code block */}
                    {message.content.split("```").map((part, index) => {
                      if (index % 2 === 0) {
                        return (
                          <Markdown key={index} remarkPlugins={[remarkGfm]}>
                            {part}
                          </Markdown>
                        );
                      } else {
                        return (
                          <pre className="whitespace-pre-wrap" key={index}>
                            <CodeDisplayBlock code={part} lang="" />
                          </pre>
                        );
                      }
                    })}
                    {isLoading &&
                      messages.indexOf(message) === messages.length - 1 && (
                        <span className="animate-pulse" aria-label="Typing">
                          ...
                        </span>
                      )}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loadingSubmit && (
          <div className="flex pl-4 pb-4 gap-2 items-center">
            <Avatar className="flex justify-start items-center">
              <AvatarImage
                src="/realpage-logo.png"
                alt="AI"
                width={6}
                height={6}
                className="object-contain"
              />
            </Avatar>
            <div className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}