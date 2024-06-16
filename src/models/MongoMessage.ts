import { Message } from "ai";

export interface MongoMessage extends Message {
    data?: {
        feedback: boolean;
    }
}