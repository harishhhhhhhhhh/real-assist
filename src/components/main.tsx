"use client";

import { useEffect} from "react";
import { useAuth } from "react-oidc-context";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/ui/loader";

interface MainProps {
  params?: {
    id?: string;
  }
}

export default function Main({ params = {} }: MainProps) {
  /* const authContext = useAuth();
  useEffect(() => {
    if (!authContext.isLoading && !authContext.isAuthenticated) {
      authContext.signinRedirect({
        state: window.location.href
      });
    }
  }, [authContext]); */

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      {/* {authContext.isLoading ?
        <Loader /> : */}
        <ChatLayout
          chatId=""
          navCollapsedSize={10}
          defaultLayout={[20, 80]}
        />
      {/* } */}
    </main>
  );
}
