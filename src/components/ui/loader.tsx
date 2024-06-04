"use client"

import { cn } from "@/lib/utils";

const Loader = (({ width, height, fullScreen = true }: { width: number; height: number; fullScreen?: boolean }) =>
    <div className={cn(
        { ['line-through']: fullScreen },
        "flex space-x-2 justify-center items-center dark:invert"
    )}>
        <span className='sr-only'>Loading...</span>
        <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
        <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
        <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce`}></div>
    </div >
)

export { Loader }
