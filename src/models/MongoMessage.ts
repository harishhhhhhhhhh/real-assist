import { Message } from "ai";

export interface MongoMessage extends Message {
    questionId?: string;
    data?: {
        feedback?: boolean;
    }
}