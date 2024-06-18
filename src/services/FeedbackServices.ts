import { MongoMessage } from "@/models";
import axiosInstance from "@/lib/axios";


const getFeedbackMessagesService = (): Promise<MongoMessage[]> => {
    return axiosInstance.get(`/api/feedback`)
        .then(response => response.data);
}

export {
    getFeedbackMessagesService,
}