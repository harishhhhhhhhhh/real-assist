
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/ui/loader";

export default function Page({ params }: { params: { id: string } }) {
  const authContext = useAuth();
  const [chatId, setChatId] = useState<string>(params.id);

  useEffect(() => {
    if (!authContext.isLoading && !authContext.isAuthenticated) {
      authContext.signinRedirect();
    }
  }, [authContext]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      {authContext.isLoading ?
        <Loader /> :
        <ChatLayout
          chatId={chatId}
          navCollapsedSize={10}
          defaultLayout={[20, 80]}
        />
      }
    </main>
  )
}
