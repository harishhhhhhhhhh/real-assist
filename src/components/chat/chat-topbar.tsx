"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { ChatSidebar } from "./chat-sidebar";
import { ModeToggle } from "../mode-toggle";

export const ChatTopbar = () => {
  return (
    <div className="w-full flex px-4 py-6 items-center justify-between lg:justify-center ">
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <HamburgerMenuIcon className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left">
          <ChatSidebar isCollapsed={false} />
        </SheetContent>
        <ModeToggle />
      </Sheet>
    </div>
  );
}
