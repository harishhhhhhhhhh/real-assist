import { FileInfo } from "@/models";
import axiosInstance from "@/lib/axios";

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

const processFileService = (): Promise<void> => {
    return axiosInstance.put(`/api/files`)
        .then(response => response.data);
}

export {
    getUploadedFilesService,
    uploadFileService,
    deleteFileService,
    processFileService,
}