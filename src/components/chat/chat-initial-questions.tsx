import { MouseEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Question } from "@/models";
import { cn } from "@/lib/utils";
import { QUESTIONS_DATA } from "@/questions";
import { Button } from "../ui/button";

export interface ChatInitialQuestionsProps {
  onClickQuestion: (e: MouseEvent, message: Question) => void;
}

export const ChatInitialQuestions = ({ onClickQuestion }: ChatInitialQuestionsProps) => {
  return (
    <div className="relative w-full h-full flex justify-center">
      <div className="absolute bottom-0 flex flex-col gap-4 w-full">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/realpage-logo.png"
            alt="AI"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
          <p className="text-center text-lg text-muted-foreground">
            How can I help you today?
          </p>
        </div>

        <div className="w-full px-4 sm:max-w-3xl grid gap-2 sm:grid-cols-3 sm:gap-4 text-sm">
          {QUESTIONS_DATA.map((question, index) => {
            const delay = Math.random() * 0.25;
            return (
              <motion.div
                key={question.content}
                className={cn(
                  {
                    ["col-start-2 col-end-3"]: index === 0,
                    ["col-start-1"]: index === 1,
                  },
                )}
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
                  className="text-center px-4 py-8 flex w-full justify-center items-center text-sm whitespace-pre-wrap"
                  onClick={(e) => onClickQuestion(e, question)}
                >
                  {question.content}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
