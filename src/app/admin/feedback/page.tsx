"use client";

import { useState } from "react";

import { Loader } from "@/components/ui/loader";

export default function FeedbackPage() {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex justify-between items-center bg-background sticky top-0 px-2 mb-4">
        <div className="text-xl font-bold">Feedback</div>
      </div>
      {loading ?
        <Loader
          className="h-80"
          width={2}
          height={2}
          fullScreen={false}
        /> :
        <div className="flex w-full">

        </div>}
    </div>
  );
}
