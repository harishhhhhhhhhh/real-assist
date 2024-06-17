import React, { useEffect, useState } from "react";
import { FileTextIcon, Trash2 } from "lucide-react";
import { DialogClose, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

import { FileInfo } from "@/models";
import { deleteFileService, getUploadedFilesService, uploadFileService } from "@/services";
import { Button } from "./ui/button";
import { Loader } from "./ui/loader";
import { Spinner } from "./ui/spinner";
import { DialogHeader } from "./ui/dialog";
import PdfFilePicker from "./ui/pdf-file-picker";

export const ManageFiles = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<FileInfo[]>([]);

    const fetchUploadedFiles = () => {
        setLoading(true);
        getUploadedFilesService()
            .then(data => setUploadedFiles(data))
            .finally(() => setLoading(false));
    }

    const handleDeleteFile = (file: FileInfo, fileIndex: number) => {
        uploadedFiles[fileIndex].loading = true;
        setUploadedFiles([...uploadedFiles]);
        deleteFileService(file)
            .then(() => {
                uploadedFiles.splice(fileIndex, 1);
                setUploadedFiles([...uploadedFiles]);
            })
            .catch(() => {
                uploadedFiles[fileIndex].loading = false;
                setUploadedFiles([...uploadedFiles]);
            });
    }

    const handleUploadFiles = (files: File[]) => {
        const formData = new FormData();
        const selectedFiles = files.map(file => {
            formData.append('files', file);
            return {
                fileName: file.name,
                filePath: '',
                lastUpdatedTime: file.lastModified,
                loading: true,
            }
        });
        setUploadingFiles([...selectedFiles]);
        uploadFileService(formData)
            .then(() => fetchUploadedFiles())
            .finally(() => setUploadingFiles([]))
    }

    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    return (<div>
        {loading ?
            <Loader
                className="h-80"
                width={2}
                height={2}
                fullScreen={false}
            /> :
            <DialogContent>
                <DialogHeader className="space-y-4 p-4">
                    <DialogTitle>Manage Files</DialogTitle>
                </DialogHeader>
                <div>
                    {uploadedFiles.length > 0 &&
                        <ul className="w-full max-h-80 overflow-auto px-2">
                            {uploadedFiles.map((file, fileIndex) => (
                                <li key={file.fileName} className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="flex-shrink-0">
                                            <FileTextIcon className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {file.fileName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {new Date(file.lastUpdatedTime).toDateString()}
                                            </p>
                                        </div>
                                        {file.loading ?
                                            <Spinner
                                                width={18}
                                                height={18}
                                            /> :
                                            <Trash2
                                                className="shrink-0 text-red-500 w-4 h-4  cursor-pointer"
                                                onClick={() => handleDeleteFile(file, fileIndex)}
                                            />
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                    <div className="flex justify-center p-4">
                        {uploadingFiles.length ?
                            <ul className="w-full max-h-80 overflow-auto px-2">
                                {uploadingFiles.map(file => (
                                    <li key={file.fileName} className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="flex-shrink-0">
                                                <FileTextIcon className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                    {file.fileName}
                                                </p>
                                            </div>
                                            <Spinner width={18} height={18} />
                                        </div>
                                    </li>
                                ))}
                            </ul> :
                            <PdfFilePicker setSelectedFiles={handleUploadFiles} />
                        }
                    </div>
                </div>
                <div className="flex justify-end gap-2 py-3 px-4">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>}
    </div>);
}