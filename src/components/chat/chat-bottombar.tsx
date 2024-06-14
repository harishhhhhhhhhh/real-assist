"use client";

import { FormEvent, useEffect, useRef, KeyboardEvent, ChangeEvent, RefObject } from "react";
import { SendHorizonal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { AnimatePresence } from "framer-motion";
import { StopIcon } from "@radix-ui/react-icons";

import { Button } from "../ui/button";

export interface ChatBottombarProps {
  input: string;
  isLoading: boolean;
  formRef: RefObject<HTMLFormElement>;
  handleStop: () => void;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const ChatBottombar = ({
  input,
  isLoading,
  formRef,
  handleStop,
  handleInputChange,
  handleSubmit,
}: ChatBottombarProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="p-4 pb-7 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <div className="w-full items-center flex relative gap-2">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full items-center flex relative gap-2"
          >
            <TextareaAutosize
              autoComplete="off"
              value={input}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="Enter your prompt here"
              className=" max-h-24 pl-8 pr-14 bg-accent py-[22px] text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-full flex items-center h-16 resize-none overflow-hidden dark:bg-card"
            />
            {!isLoading ? (
              <div className="flex absolute right-3 items-center">
                <Button
                  className="shrink-0 rounded-full"
                  variant="ghost"
                  size="icon"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                >
                  <SendHorizonal className="w-5 h-5 " />
                </Button>
              </div>
            ) : (
              <div className="flex absolute right-3 items-center">
                <Button
                  className="shrink-0 rounded-full"
                  variant="ghost"
                  size="icon"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleStop();
                  }}
                >
                  <StopIcon className="w-5 h-5" />
                </Button>
              </div>
            )}
          </form>
        </div>
      </AnimatePresence>
    </div>
  );
}
