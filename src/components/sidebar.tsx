"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Message } from "ai/react";
import { MessagesSquare, MoreVertical, SquarePen, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chat } from "@/models/Chat";
import { getChatsListService, deleteChatDataService } from "@/services";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserSettings from "./user-settings";
import SidebarSkeleton from "./sidebar-skeleton";

interface SidebarProps {
  chatParamId: string;
  isCollapsed: boolean;
  setMessages: (messages: Message[]) => void;
}

export function Sidebar({
  chatParamId,
  isCollapsed,
  setMessages,
}: SidebarProps) {
  const router = useRouter();
  const [localChats, setLocalChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* const getLocalstorageChats = (): {
    chatId: string;
    messages: Message[];
  }[] => {
    const chats = Object.keys(localStorage).filter((key) =>
      key.startsWith("chat_")
    );

    if (chats.length === 0) {
      setIsLoading(false);
    }

    // Map through the chats and return an object with chatId and messages
    const chatObjects = chats.map((chat) => {
      const item = localStorage.getItem(chat);
      return item
        ? { chatId: chat, messages: JSON.parse(item) }
        : { chatId: '', messages: [] };
    });

    // Sort chats by the createdAt date of the first message of each chat
    chatObjects.sort((a, b) => {
      const aDate = new Date(a.messages[0].createdAt);
      const bDate = new Date(b.messages[0].createdAt);
      return bDate.getTime() - aDate.getTime();
    });

    setIsLoading(false);
    return chatObjects;
  }; */


  const getChatsList = () => {
    setIsLoading(true);
    getChatsListService()
      .then(data => setLocalChats(data))
      .finally(() => setIsLoading(false));
  }

  const handleDeleteChat = (chatId: string) => {
    deleteChatDataService(chatId)
      .then(() => getChatsList());
  };

  useEffect(() => {
    console.log("Object:::::::");
    getChatsList();
  }, []);

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 lg:flex">
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        <Button
          onClick={() => {
            router.push('/');
            setMessages([]);
          }}
          variant="ghost"
          className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center "
        >
          <div className="flex gap-3 items-center">
            <Image
              src="/realpage-logo.png"
              alt="AI"
              width={28}
              height={28}
            />
            Real Assist
          </div>
          <SquarePen size={18} className="shrink-0 w-4 h-4" />
        </Button>


        {isLoading ?
          <SidebarSkeleton /> :
          <div>
            {localChats.length ? (
              <div className="flex flex-col pt-10 gap-2">
                <p className="pl-4 text-sm text-muted-foreground">Your chats</p>

                <div>
                  {localChats.map(({ id, conversation }) => (
                    <Link
                      key={id}
                      href={`/chat/${id}`}
                      className={cn(
                        {
                          [buttonVariants({ variant: "secondaryLink" })]:
                            id === chatParamId,
                          [buttonVariants({ variant: "ghost" })]:
                            id !== chatParamId,
                        },
                        "flex justify-between w-full h-14 text-base font-normal items-center px-4 my-2"
                      )}
                    >
                      <div className="flex gap-3 items-center truncate">
                        <div className="flex flex-col">
                          {conversation.length && (
                            <span className="text-sm font-normal ">
                              {conversation[0].content}
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex justify-end items-center p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={15} className="shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full flex gap-2 hover:text-red-500 text-red-500 justify-start items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="shrink-0 w-4 h-4" />
                                Delete chat
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader className="space-y-4">
                                <DialogTitle>Delete chat?</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this chat? This
                                  action cannot be undone.
                                </DialogDescription>
                                <div className="flex justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button
                                      variant="outline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDeleteChat(id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogClose>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Link>
                  ))
                  }
                </div>
              </div>
            ) :
              <div className="flex flex-col justify-center items-center h-screen">
                <MessagesSquare size={34} className=" text-muted-foreground" />
                <p className="text-base text-muted-foreground">No Chats available</p>
              </div>
            }
          </div>
        }
      </div>

      <div className="justify-end px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
