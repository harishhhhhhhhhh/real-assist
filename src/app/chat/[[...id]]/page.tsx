
"use client";

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/ui/loader";

export default function Page({ params }: { params: { id: string } }) {
  const paramsId = params.id?.[0];
  const authContext = useAuth();

  useEffect(() => {
    if (!authContext.isLoading && !authContext.isAuthenticated) {
      authContext.signinRedirect({ state: window.location.href });
    }
  }, [authContext]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      {authContext.isLoading ?
        <Loader /> :
        <ChatLayout
          paramId={paramsId}
          navCollapsedSize={10}
          defaultLayout={[20, 80]}
        />
      }
    </main>
  )
}
