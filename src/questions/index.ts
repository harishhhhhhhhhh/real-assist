import { Question } from "@/models";

import { USA_QUESTIONS } from "./usa";
import { INDIA_QUESTIONS } from "./india";
import { PHILIPPINES_QUESTIONS } from "./philippines";

export const QUESTIONS_DATA: Question[] = [
  {
    content: "USA",
    questions: USA_QUESTIONS,
  },
  {
    content: "India",
    questions: INDIA_QUESTIONS,
  },
  {
    content: "Philippines",
    questions: PHILIPPINES_QUESTIONS,
  },
];