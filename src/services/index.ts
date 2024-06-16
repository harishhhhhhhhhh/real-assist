import axios from "axios";

import { Chat, MongoMessage } from "@/models";

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

export type Message = Omit<MongoMessage, 'id'> & {};

const getChatsService = (): Promise<Chat[]> => {
    return axiosInstance.get('/api/chat')
        .then(response => response.data);
}

const deleteChatsService = (): Promise<Chat[]> => {
    return axiosInstance.delete('/api/chat')
        .then(response => response.data);
}

const getChatDataService = (chatId: string): Promise<Chat> => {
    return axiosInstance.get(`/api/chat/${chatId}`)
        .then(response => response.data);
}

const createChatDataService = (messages: Message[]): Promise<Chat> => {
    return axiosInstance.post(`/api/chat`, messages)
        .then(response => response.data);
}

const deleteChatDataService = (chatId: string): Promise<void> => {
    return axiosInstance.delete(`/api/chat/${chatId}`)
        .then(response => response.data);
}

const createMessageDataService = (
    chatId: string,
    message: Message,
): Promise<Message> => {
    return axiosInstance.post(`/api/chat/${chatId}/message`, message)
        .then(response => response.data);
}

const updateFeedbackService = (
    messageId: string,
    feedback: boolean,
): Promise<Message> => {
    return axiosInstance.patch(`/api/chat/message/${messageId}`, {
        feedback
    })
        .then(response => response.data);
}

export {
    setAuthToken,
    getChatsService,
    deleteChatsService,
    getChatDataService,
    createChatDataService,
    deleteChatDataService,
    createMessageDataService,
    updateFeedbackService,
}