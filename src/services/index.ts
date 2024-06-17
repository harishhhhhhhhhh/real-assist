import axios from "axios";

import { Chat, FileInfo, MongoMessage } from "@/models";

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
    message: MongoMessage,
): Promise<Message> => {
    return axiosInstance.post(`/api/chat/${chatId}/message`, message)
        .then(response => response.data);
}

const updateFeedbackService = (
    messageId: string,
    feedback?: boolean,
): Promise<Message> => {
    return axiosInstance.patch(`/api/chat/message/${messageId}`, { feedback })
        .then(response => response.data);
}

const getAnalyticsDataService = (): Promise<MongoMessage[]> => {
    return axiosInstance.get(`/api/chat/analytics`)
        .then(response => response.data);
}

const getUploadedFilesService = (): Promise<FileInfo[]> => {
    return axiosInstance.get(`/api/files`)
        .then(response => response.data);
}

const uploadFileService = (formData: FormData): Promise<FileInfo[]> => {
    return axiosInstance.post(`/api/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(response => response.data);
}

const deleteFileService = (file: FileInfo): Promise<void> => {
    return axiosInstance.delete(`/api/files`, {
        params: {
            fileName: file.fileName
        }
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
    getAnalyticsDataService,
    getUploadedFilesService,
    uploadFileService,
    deleteFileService,
}