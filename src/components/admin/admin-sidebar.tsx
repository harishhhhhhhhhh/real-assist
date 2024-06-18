"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserSettings } from "../user-settings";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const navItems = [{
    label: 'Feedback',
    link: '/admin/feedback',
  }, {
    label: 'Manage Files',
    link: '/admin/manage-files',
  }, {
    label: 'Categories',
    link: '/admin/categories',
  }]

  return (
    <div className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 lg:flex">
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        <div className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center">
          <div className="flex gap-3 items-center">
            <Image
              src="/realpage-logo.png"
              alt="AI"
              width={28}
              height={28}
            />
            Admin
          </div>
        </div>
        <div>
          {navItems.map(item =>
            <Link
              key={item.link}
              href={item.link}
              className={cn(
                {
                  [buttonVariants({ variant: "outline" })]:
                    item.link === pathname,
                  [buttonVariants({ variant: "ghost" })]:
                    item.link !== pathname,
                },
                "flex justify-between w-full h-14 text-base font-normal items-center px-4 my-2"
              )}
            >
              <div className="flex items-center truncate">
                <span className="text-sm font-normal">
                  {item.label}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="justify-end px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
