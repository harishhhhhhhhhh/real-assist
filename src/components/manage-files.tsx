import React, { useEffect, useRef, useState } from "react";
import { FileTextIcon, RotateCcw, Trash2, X } from "lucide-react";

import { FileInfo } from "@/models/FileInfo";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "./ui/tabs";
import PdfFilePicker from "./ui/pdf-file-picker";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Loader } from "./ui/loader";
import { cn } from "@/lib/utils";

export default function ManageFiles() {
    const [loading, setLoading] = useState<boolean>(false);
    const deletedFilesRef = useRef<number>(0);
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fetchUploadedFiles = () => {
        setLoading(true);
        fetch('/api/files')
            .then(async response => await response.json())
            .then(data => setUploadedFiles(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }

    const markUploadedFile = (fileIndex: number, deleteIndicator: boolean) => {
        deletedFilesRef.current = 0;
        const files = uploadedFiles.map((item, index) => {
            if (index === fileIndex) {
                item.deleteIndicator = !deleteIndicator;
            }
            if (item.deleteIndicator) {
                deletedFilesRef.current += 1;
            }
            return item;
        });
        setUploadedFiles(files);
    }

    const removeSelectedFile = (fileIndex: number) => {
        let files = [...selectedFiles];
        files.splice(fileIndex, 1);
        setSelectedFiles(files);
    }

    const handleDeleteFiles = () => {
        /* setLoading(true);
        fetch('/api/files')
            .then(async response => await response.json())
            .then(data => setUploadedFiles(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false)); */
    }

    const handleUploadFiles = () => {
        /* setLoading(true);
        fetch('/api/files')
            .then(async response => await response.json())
            .then(data => setUploadedFiles(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false)); */
    }

    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    return (
        <div>
            {loading ?
                <Loader
                    className="h-80"
                    width={2}
                    height={2}
                    fullScreen={false}
                /> :
                <Tabs
                    className="flex flex-col w-full"
                    defaultValue={uploadedFiles.length ? 'tab1' : 'tab2'}
                >
                    <TabsList aria-label="Manage Files">
                        {uploadedFiles.length > 0 &&
                            <TabsTrigger value="tab1"
                                className="px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] data-[state=active]:border-b-2 data-[state=active]:border-b-orange-700 hover:bg-accent outline-none cursor-pointer">
                                Processed Files
                            </TabsTrigger>
                        }
                        <TabsTrigger value="tab2"
                            className="px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] data-[state=active]:border-b-2 data-[state=active]:border-b-orange-700 hover:bg-accent outline-none cursor-pointer">
                            Upload Files
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">

                        <div className="p-4">
                            <ul className="width-full h-80 overflow-auto">
                                {uploadedFiles.map((file, fileIndex) => (
                                    <li key={file.fileName} className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="flex-shrink-0">
                                                <FileTextIcon className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    { ['line-through']: file.deleteIndicator },
                                                    "text-sm font-medium text-gray-900 truncate dark:text-white"
                                                )}>
                                                    {file.fileName}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {new Date(file.lastUpdatedTime).toDateString()}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center cursor-pointer p-2"
                                                onClick={() => markUploadedFile(fileIndex, file.deleteIndicator)}>
                                                {
                                                    file.deleteIndicator ?
                                                        <RotateCcw className="shrink-0 w-4 h-4" /> :
                                                        <Trash2 className="shrink-0 text-red-500 w-4 h-4" />
                                                }
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-end">
                                <div className="text-sm mb-2 ml-2">Delete {deletedFilesRef.current} files</div>
                                <div className="flex gap-2 mt-4">
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        variant="default"
                                        disabled={!deletedFilesRef.current}
                                        onClick={handleDeleteFiles}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="tab2">
                        <div className="p-4">
                            {selectedFiles.length ? (
                                <>
                                    <ul className="width-full h-80 overflow-auto">
                                        {selectedFiles.map((file, fileIndex) => (
                                            <li key={file.name} className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                    <div className="flex-shrink-0">
                                                        <FileTextIcon className="w-8 h-8" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                            {Math.ceil(file.size / 1000)} KB
                                                        </p>
                                                    </div>
                                                    <div className="inline-flex items-center cursor-pointer text-red-500 p-2"
                                                        onClick={() => removeSelectedFile(fileIndex)}>
                                                        <X className="shrink-0 w-4 h-4" />
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm mb-2 ml-2">Selected {selectedFiles.length} files</div>
                                        <div className="flex gap-2 mt-4">
                                            <DialogClose asChild>
                                                <Button
                                                    variant="outline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                variant="default"
                                                disabled={!selectedFiles.length}
                                                onClick={handleUploadFiles}
                                            >
                                                Upload
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) :
                                <div className="flex justify-center h-80">
                                    <PdfFilePicker setSelectedFiles={setSelectedFiles} />
                                </div>
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            }
        </div>
    );
}