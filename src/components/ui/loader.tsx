"use client"

import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    width: number;
    height: number;
    content?: string;
    fullScreen?: boolean;
}

const Loader = (({
    className,
    width,
    height,
    content,
    fullScreen = true
}: LoaderProps) =>
    <div className={cn(
        { ['h-screen']: fullScreen },
        "flex flex-col justify-center items-center",
        className
    )}>
        <div className="flex space-x-2 dark:invert">
            <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
            <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
            <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce`}></div>
        </div>
        {content && <div className="mt-3">{content}</div>}
    </div >
)

export { Loader }
