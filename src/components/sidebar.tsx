"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessagesSquare, MoreVertical, SquarePen, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chat } from "@/models/Chat";
import { APPLICATION_NAME } from "@/lib/constants";
import { getChatsService, deleteChatDataService, deleteChatsService } from "@/services";
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
import { UserSettings } from "./user-settings";
import { SidebarSkeleton } from "./sidebar-skeleton";

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const router = useRouter();
  const params = useParams();
  const refreshChatId = '/chat/123456c1234c12345e123456';
  const chatParamId = params.id?.[0];
  const [localChats, setLocalChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getChatsList = () => {
    setIsLoading(true);
    getChatsService()
      .then(data => setLocalChats(data))
      .finally(() => setIsLoading(false));
  }

  const handleDeleteChat = (chatId: string) => {
    deleteChatDataService(chatId)
      .then(() => {
        if (chatId === chatParamId) {
          router.push(refreshChatId);
        } else {
          getChatsList();
        }
      });
  };

  const handleDeleteAllChats = () => {
    deleteChatsService()
      .then(() => {
        router.push(refreshChatId);
        getChatsList();
      });
  };

  useEffect(() => {
    getChatsList();
    window.addEventListener("storage", getChatsList);
    return () => {
      window.removeEventListener("storage", getChatsList);
    };
  }, []);

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 lg:flex">
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        <Button
          onClick={() => router.push(refreshChatId)}
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
            {APPLICATION_NAME}
          </div>
          <SquarePen size={18} className="shrink-0 w-4 h-4" />
        </Button>


        {isLoading ?
          <SidebarSkeleton /> :
          <div>
            {localChats.length ? (
              <div className="flex flex-col pt-10 gap-2">
                <div className="flex w-full justify-between items-center">
                  <p className="text-sm text-muted-foreground">Your chats</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hover:text-red-500 text-red-500 justify-start items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="shrink-0 w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="space-y-4">
                        <DialogTitle>Delete all chats?</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete all of your chats? This action cannot be undone.
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
                              onClick={() => handleDeleteAllChats()}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  {localChats.map(({ id, messages }) => (
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
                          <span className="text-sm font-normal ">
                            {messages.length ? messages[0].content : 'New Chat'}
                          </span>
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
                                  Are you sure you want to delete this chat? This action cannot be undone.
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
