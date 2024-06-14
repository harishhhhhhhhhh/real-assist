import { Skeleton } from "@/components/ui/skeleton";

export const ChatListSkeleton = () => {
  return (
    <div className="relative w-full h-full flex">
      <div className="flex flex-col w-full gap-2 justify-end">

        <div className="flex h-14 w-5/12 bg-primary/5 opacity-10 justify-between rounded-xl items-center self-end p-2">
          <Skeleton className="h-6 w-2/3 rounded-sm" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="flex h-14 w-1/2 bg-primary/5 opacity-20 justify-between rounded-xl items-center self-start p-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-2/3 rounded-sm" />
        </div>

        <div className="flex h-14 w-5/12 bg-primary/5 opacity-30 justify-between rounded-xl items-center self-end p-2">
          <Skeleton className="h-6 w-2/3 rounded-sm" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="flex h-14 w-1/2 bg-primary/5 opacity-40 justify-between rounded-xl items-center self-start p-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-2/3 rounded-sm" />
        </div>

        <div className="flex h-14 w-5/12 bg-primary/5 opacity-50 justify-between rounded-xl items-center self-end p-2">
          <Skeleton className="h-6 w-2/3 rounded-sm" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="flex h-14 w-1/2 bg-primary/5 opacity-60 justify-between rounded-xl items-center self-start p-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-2/3 rounded-sm" />
        </div>

        <div className="flex h-14 w-5/12 bg-primary/5 opacity-70 justify-between rounded-xl items-center self-end p-2">
          <Skeleton className="h-6 w-2/3 rounded-sm" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="flex h-14 w-1/2 bg-primary/5 opacity-80 justify-between rounded-xl items-center self-start p-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-2/3 rounded-sm" />
        </div>

        <div className="flex h-14 w-5/12 bg-primary/5 opacity-90 justify-between rounded-xl items-center self-end p-2">
          <Skeleton className="h-6 w-2/3 rounded-sm" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="flex h-14 w-1/2 bg-primary/5 opacity-100 justify-between rounded-xl items-center self-start p-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-2/3 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
