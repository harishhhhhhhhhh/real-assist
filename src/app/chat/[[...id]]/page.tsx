"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import { setAuthToken } from "@/services";
import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/ui/loader";

export default function Page({ params }: { params: { id: string } }) {
  const paramsId = params.id?.[0];
  const authContext = useAuth();
  const [pageLoading, setPageloading] = useState<boolean>(true);

  useEffect(() => {
    if (!authContext.isLoading && !authContext.isAuthenticated) {
      authContext.signinRedirect({ state: window.location.href });
    } else if (authContext.user) {
      console.log("Here:::");
      setAuthToken(authContext.user.access_token);
      setTimeout(() => setPageloading(false));
    }
  }, [authContext]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      {(authContext.isLoading || pageLoading) ?
        <Loader width={4} height={4} /> :
        <ChatLayout
          paramId={paramsId}
          navCollapsedSize={10}
          defaultLayout={[20, 80]}
        />
      }
    </main>
  )
}
