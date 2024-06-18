"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import { setAuthToken } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const authContext = useAuth();
    const [pageLoading, setPageloading] = useState<boolean>(true);

    useEffect(() => {
        if (!authContext.isLoading && !authContext.isAuthenticated) {
            authContext.signinRedirect({ state: window.location.href });
        } else if (authContext.user) {
            setAuthToken(authContext.user.access_token);
            setTimeout(() => setPageloading(false));
        }
    }, [authContext]);

    return (
        <main className="flex h-[calc(100dvh)] flex-col items-center ">
            {(authContext.isLoading || pageLoading) ?
                <Loader width={4} height={4} /> :
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-screen items-stretch"
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={15}
                        maxSize={20}
                    >
                        <AdminSidebar />
                    </ResizablePanel>
                    <ResizableHandle className={cn("hidden lg:flex")} withHandle />
                    <ResizablePanel
                        className="h-full w-full flex p-4"
                        defaultSize={85}
                        minSize={80}
                        maxSize={85}
                    >
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            }
        </main>
    )
}
