import { useRef, useEffect, ChangeEvent, RefObject, MouseEvent, useState } from "react";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { Question } from "@/models/Question";
import { useUserData } from "@/app/hooks/useUserData";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatListSkeleton } from "../chat-list-skeleton";
import { CodeDisplayBlock } from "../code-display-block";
import { ChatInitialQuestions } from "./chat-initial-questions";
import { ChatFollowQuestions } from "./chat-follow-questions";

export interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
  chatLoading: boolean;
  loadingSubmit: boolean;
  formRef: RefObject<HTMLFormElement>;
  error: undefined | Error;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ChatList = ({
  messages,
  isLoading,
  chatLoading,
  loadingSubmit,
  formRef,
  handleInputChange,
}: ChatListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { userName } = useUserData();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAssistantAnswered, setIsAssistantAnswered] = useState<boolean>(false);

  const onClickQuestion = (e: MouseEvent, message: Question) => {
    e.preventDefault();
    const messageContent = message.questions ? `@${message.content}` : message.content;
    if (message.questions?.length) {
      setQuestions(message.questions);
    }
    handleInputChange({ target: { value: messageContent } } as ChangeEvent<HTMLTextAreaElement>);
    setTimeout(() => {
      formRef.current?.dispatchEvent(
        new Event("submit", {
          cancelable: true,
          bubbles: true,
        })
      );
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    if (!isLoading && !loadingSubmit && messages.length) {
      setIsAssistantAnswered(messages[messages.length - 1].role === 'assistant');
    }
  }, [messages]);

  if (chatLoading) {
    return <ChatListSkeleton />;
  }

  if (messages.length === 0) {
    return <ChatInitialQuestions
      onClickQuestion={onClickQuestion}
    />
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
                  <Avatar className="flex justify-start items-center rounded-full border">
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
                <div>
                  <div className="flex items-end gap-2">
                    <Avatar className="flex justify-start items-center rounded-full border">
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
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loadingSubmit ? (
          <div className="flex pl-4 pb-4 gap-2 items-center">
            <Avatar className="flex justify-start items-center rounded-full border">
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
        ) : ((!isLoading && questions.length > 0) &&
          <div className="flex pl-4 pb-4 gap-2 items-start">
            {!isAssistantAnswered &&
              <Avatar className="flex justify-start items-center rounded-full border">
                <AvatarImage
                  src="/realpage-logo.png"
                  alt="AI"
                  width={6}
                  height={6}
                  className="object-contain"
                />
              </Avatar>
            }
            <ChatFollowQuestions
              expanded={!isAssistantAnswered}
              questions={questions}
              onClickQuestion={onClickQuestion}
            />
          </div>
        )}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
