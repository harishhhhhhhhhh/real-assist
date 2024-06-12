import { Message } from "ai";

export interface Chat {
    id: string;
    userId: number;
    messages: Message[];
}