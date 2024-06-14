import { MouseEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Question } from "@/models/Question";

import { Button } from "../ui/button";

export interface ChatFollowQuestionsProps {
  expanded: boolean;
  questions: Question[];
  onClickQuestion: (e: MouseEvent, message: Question) => void;
}

export const ChatFollowQuestions = ({
  expanded,
  questions,
  onClickQuestion,
}: ChatFollowQuestionsProps) => {
  const [openState, setOpenState] = useState<boolean>(expanded);

  useEffect(() => {
    setOpenState(expanded);
  }, [expanded]);

  return (
    <>
      {!expanded &&
        <div className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground p-2 rounded-md cursor-pointer group"
          onClick={() => setOpenState(!openState)}>
          <div className="flex gap-1">
            <span className="size-1 rounded-full bg-slate-700 group-hover:motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
            <span className="size-1 rounded-full bg-slate-700 group-hover:motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
            <span className="size-1 rounded-full bg-slate-700 group-hover:motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
          </div>
        </div>
      }
      {openState &&
        <div className="w-1/2 grid grid-cols-1 gap-2 text-sm">
          {questions.map(question => {
            const delay = Math.random() * 0.25;
            return (
              <motion.div
                key={question.content}
                initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                transition={{
                  opacity: { duration: 0.1, delay },
                  scale: { duration: 0.1, delay },
                  y: { type: "spring", stiffness: 100, damping: 10, delay },
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="sm:text-start px-4 py-6 flex justify-center sm:justify-start items-center text-sm whitespace-pre-wrap"
                  onClick={(e) => onClickQuestion(e, question)}
                >
                  {question.content}
                </Button>
              </motion.div>
            );
          })}
        </div>
      }
    </>
  )
}
