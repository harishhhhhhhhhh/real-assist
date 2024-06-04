"use client";

import { ExitIcon, UploadIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useUserData } from "@/app/hooks/useUserData";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import ManageFiles from "./manage-files";

export default function UserSettings() {
  const { userName, signoutRedirect } = useUserData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-start gap-3 w-full h-14 text-base font-normal items-center "
        >
          <Avatar className="flex justify-start items-center overflow-hidden">
            <AvatarImage
              src=""
              alt="AI"
              width={4}
              height={4}
              className="object-contain"
            />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-base truncate">
            {userName}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
                <UploadIcon className="w-4 h-4" />
                Manage Files
              </div>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden">
              <ManageFiles />
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => signoutRedirect()}>
          <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
            <ExitIcon className="w-4 h-4" />
            Logout
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
