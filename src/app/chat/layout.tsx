"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import { setAuthToken } from "@/services";
import { Loader } from "@/components/ui/loader";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navCollapsedSize = 10;
    const defaultLayout = [20, 80];
    const authContext = useAuth();
    const [pageLoading, setPageloading] = useState<boolean>(true);
    const [isCollapsed, setIsCollapsed] = useState<boolean>();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (!authContext.isLoading && !authContext.isAuthenticated) {
            authContext.signinRedirect({ state: window.location.href });
        } else if (authContext.user) {
            setAuthToken(authContext.user.access_token);
            setTimeout(() => setPageloading(false));
        }
    }, [authContext]);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth <= 1023);
        };
        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

    return (
        <main className="flex h-[calc(100dvh)] flex-col items-center ">
            {(authContext.isLoading || pageLoading) ?
                <Loader width={4} height={4} /> :
                <ResizablePanelGroup
                    direction="horizontal"
                    onLayout={(sizes: number[]) => {
                        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                            sizes
                        )}`;
                    }}
                    className="h-screen items-stretch"
                >
                    <ResizablePanel
                        defaultSize={defaultLayout[0]}
                        collapsedSize={navCollapsedSize}
                        collapsible={true}
                        minSize={isMobile ? 0 : 15}
                        maxSize={isMobile ? 0 : 20}
                        onCollapse={() => {
                            setIsCollapsed(true);
                            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                                true
                            )}`;
                        }}
                        onExpand={() => {
                            setIsCollapsed(false);
                            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                                false
                            )}`;
                        }}
                        className={cn(
                            isCollapsed
                                ? "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
                                : "hidden md:block"
                        )}
                    >
                        <Sidebar
                            isCollapsed={isCollapsed || isMobile}
                        />
                    </ResizablePanel>
                    <ResizableHandle className={cn("hidden lg:flex")} withHandle />
                    <ResizablePanel
                        className="h-full w-full flex justify-center"
                        defaultSize={defaultLayout[1]}
                        collapsedSize={navCollapsedSize}
                        minSize={isMobile ? 0 : 80}
                        maxSize={isMobile ? 0 : 85}
                    >
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            }
        </main>
    )
}
