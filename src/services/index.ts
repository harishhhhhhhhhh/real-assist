import axios from "axios";
import { Message } from "ai";

import { Chat } from "@/models/Chat";

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

const setAuthToken = (token: string) => {
    axiosInstance.interceptors.request.use(
        config => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );
};

export type MongoMessage = Omit<Message, 'id'> & { id?: string };

const getChatsListService = (): Promise<Chat[]> => {
    return axiosInstance.get('/api/chat')
        .then(response => response.data);
}

const createChatDataService = (messages: MongoMessage[]): Promise<Chat> => {
    return axiosInstance.post(`/api/chat`, messages)
        .then(response => response.data);
};

const getChatDataService = (chatId: string): Promise<Chat> => {
    return axiosInstance.get(`/api/chat/${chatId}`)
        .then(response => response.data);
}

const deleteChatDataService = (chatId: string): Promise<void> => {
    return axiosInstance.delete(`/api/chat/${chatId}`)
        .then(response => response.data);
};

const createMessageDataService = (
    chatId: string,
    message: MongoMessage,
): Promise<Message> => {
    return axiosInstance.post(`/api/chat/${chatId}/message`, message)
        .then(response => response.data);
};

export {
    setAuthToken,
    getChatsListService,
    getChatDataService,
    createChatDataService,
    deleteChatDataService,
    createMessageDataService,
}