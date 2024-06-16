import { MongoMessage } from "./MongoMessage";

export interface Chat {
    id: string;
    userId: number;
    messages: MongoMessage[];
    createdAt: Date;
}