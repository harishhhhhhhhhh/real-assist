import React, { useEffect, useState } from "react";
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

//import PullModelForm from "./pull-model-form";

export default function ManageFiles() {
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fetchUploadedFiles = () => {
        setLoading(true);
        fetch('/api/files')
            .then(async response => await response.json())
            .then(data => setUploadedFiles(data))
            .catch(error => console.log(error))
        //.finally(() => setLoading(false));
    }

    const markUploadedFile = (fileIndex: number, deleteIndicator: boolean) => {
        let files = [...uploadedFiles];
        files[fileIndex].deleteIndicator = !deleteIndicator;
        setUploadedFiles(files);
    }

    const removeSelectedFile = (fileIndex: number) => {
        let files = [...selectedFiles];
        files.splice(fileIndex, 1);
        setSelectedFiles(files);
    }

    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    return (
        <div>


            <Tabs
                className="flex flex-col w-full"
                defaultValue="tab1"
            >
                <TabsList className="shrink-0 flex border-b" aria-label="Manage your account">
                    <TabsTrigger
                        className="bg-accent border px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:focus:bg-background outline-none cursor-pointer"
                        value="tab1"
                    >
                        Processed Files
                    </TabsTrigger>
                    <TabsTrigger
                        className="bg-accent border px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:focus:bg-background outline-none cursor-pointer"
                        value="tab2"
                    >
                        Upload Files
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    className="grow p-5 bg-background rounded-b-md outline-none"
                    value="tab1"
                >
                    {loading ?
                        <Loader width={2} height={2} fullScreen={false}/> :
                        <div>
                            <ul className="width-full">
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
                            <div className="flex justify-end gap-2 mt-4">
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
                                    disabled={!!uploadedFiles.length}
                                //onClick={() => handleDeleteChat(chatId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    }
                </TabsContent>
                <TabsContent
                    className="grow p-5 bg-background rounded-b-md outline-none"
                    value="tab2"
                >
                    <div>
                        {selectedFiles.length ? (
                            <ul className="width-full">
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
                        ) : <PdfFilePicker setSelectedFiles={setSelectedFiles} />}
                        <div className="flex justify-end gap-2 mt-4">
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
                                disabled={!!selectedFiles.length}
                            //onClick={() => handleDeleteChat(chatId)}
                            >
                                Upload
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
}