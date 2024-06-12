import { Message } from "ai";

import { Conversation } from "@/models/Conversation";

const getChatsListService = () => {
    return fetch('/api/chat', {
        method: 'GET'
    }).then(async response => await response.json());
}

const createChatDataService = (messages: Conversation[]) => {
    return fetch(`/api/chat`, {
        method: 'POST',
        body: JSON.stringify(messages),
    }).then(async response => await response.json())
};

const getChatDataService = (chatId: string) => {
    return fetch(`/api/chat/${chatId}`, { method: 'GET' })
        .then(async response => await response.json());
}

const deleteChatDataService = (chatId: string) => {
    return fetch(`/api/chat/${chatId}`, { method: 'DELETE' })
        .then(async response => await response.json())
};

const createConversationDataService = (chatId: string, message: Conversation) => {
    return fetch(`/api/chat/${chatId}/conversation`, {
        method: 'POST',
        body: JSON.stringify(message),
    }).then(async response => await response.json())
};

export {
    getChatsListService,
    getChatDataService,
    createChatDataService,
    deleteChatDataService,
    createConversationDataService,
}