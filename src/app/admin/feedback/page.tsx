"use client";

import { useEffect, useState } from "react";

import { getFeedbackMessagesService } from "@/services";
import { Loader } from "@/components/ui/loader";
import { MongoMessage } from "@/models";

export default function FeedbackPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackData, setFeedbackData] = useState<MongoMessage[]>([]);

  useEffect(() => {
    setLoading(true);
    getFeedbackMessagesService()
      .then(data => setFeedbackData(data))
      .finally(() => setLoading(false));
  }, [])

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
        <div className="flex flex-col w-full">
          {feedbackData.map(item => 
            <div>{item.id}</div>
          )}
        </div>}
    </div>
  );
}
