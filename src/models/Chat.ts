import { Conversation } from "./Conversation";

export interface Chat {
    id: string;
    userId: number;
    conversation: Conversation[];
}