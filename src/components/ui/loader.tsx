"use client"

import { cn } from "@/lib/utils";

interface LoaderProps {
    className?:string;
    width: number; 
    height: number; 
    fullScreen?: boolean;
}

const Loader = (({ 
    className, 
    width, 
    height, 
    fullScreen = true
}: LoaderProps) =>
    <div className={cn(
        { ['h-screen']: fullScreen },
        "flex space-x-2 justify-center items-center dark:invert",
        className
    )}>
        <span className='sr-only'>Loading...</span>
        <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
        <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
        <div className={`h-${width} w-${height} bg-black rounded-full animate-bounce`}></div>
    </div >
)

export { Loader }
