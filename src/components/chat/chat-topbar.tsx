"use client";

import { Message } from "ai/react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Sidebar } from "../sidebar";
import { ModeToggle } from "../mode-toggle";

interface ChatTopbarProps {
  chatId: string;
  setMessages: (messages: Message[]) => void;
}

export default function ChatTopbar({
  chatId,
  setMessages,
}: ChatTopbarProps) {
  return (
    <div className="w-full flex px-4 py-6 items-center justify-between lg:justify-center ">
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <HamburgerMenuIcon className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar
            chatParamId={chatId}
            isCollapsed={false}
            setMessages={setMessages}
          />
        </SheetContent>
        <ModeToggle />
      </Sheet>
    </div>
  );
}
