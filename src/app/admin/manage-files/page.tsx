"use client";

import { useEffect, useState } from "react";
import { FileTextIcon, Trash2, X } from "lucide-react";

import { FileInfo } from "@/models";
import {
  deleteFileService,
  getUploadedFilesService,
  uploadFileService,
  processFileService
} from "@/services";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Spinner } from "@/components/ui/spinner";
import PdfFilePicker from "@/components/ui/pdf-file-picker";

export default function ManageFilesPage() {
  const [loadingText, setLoadingText] = useState<string | undefined>("Processing docs. Please wait.");
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<FileInfo[]>([]);

  const fetchUploadedFiles = () => {
    setLoadingText('');
    getUploadedFilesService()
      .then(data => setUploadedFiles(data))
      .finally(() => setLoadingText(undefined));
  }

  const handleDeleteFile = (file: FileInfo, fileIndex: number) => {
    uploadedFiles[fileIndex].loading = true;
    setUploadedFiles([...uploadedFiles]);
    deleteFileService(file)
      .then(() => processFiles())
      .catch(() => {
        uploadedFiles[fileIndex].loading = false;
        setUploadedFiles([...uploadedFiles]);
      });
  }

  const handleUploadFiles = () => {
    const formData = new FormData();
    const files = selectedFiles.map(file => {
      formData.append('files', file);
      return {
        fileName: file.name,
        filePath: '',
        lastUpdatedTime: file.lastModified,
        loading: true,
      }
    });
    setUploadingFiles([...files]);
    uploadFileService(formData)
      .then(() => processFiles())
      .finally(() => {
        setSelectedFiles([]);
        setUploadingFiles([]);
      })
  }

  const processFiles = () => {
    setLoadingText("Please wait. Processing documents...")
    processFileService()
      .then(() => fetchUploadedFiles())
      .finally(() => setLoadingText(undefined))
  }

  useEffect(() => {
    fetchUploadedFiles();
  }, []);
  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex justify-between items-center bg-background sticky top-0 px-2 mb-4">
        <div className="text-xl font-bold">Manage Files</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              onClick={(e) => e.stopPropagation()}
            >
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-hidden">
            <DialogHeader className="space-y-4">
              <DialogTitle>Upload Files</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              {selectedFiles.length ?
                <ul className="w-full max-h-80 overflow-auto px-2">
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
                          onClick={() => {
                            selectedFiles.splice(fileIndex, 1);
                            setSelectedFiles([...selectedFiles]);
                          }}>
                          <X className="shrink-0 w-4 h-4" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul> :
                <PdfFilePicker className="py-4" setSelectedFiles={setSelectedFiles} />
              }
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  disabled={!selectedFiles.length}
                  onClick={() => handleUploadFiles()}
                >
                  Upload
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {loadingText !== undefined ?
        <Loader
          className="h-80"
          width={2}
          height={2}
          content={loadingText}
          fullScreen={false}
        /> :
        <div className="flex w-full">
          {(uploadedFiles.length > 0 || uploadingFiles.length > 0) &&
            <ul className="w-full">
              {[
                ...uploadingFiles,
                ...uploadedFiles,
              ].map((file, fileIndex) => (
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
        </div>}
    </div>
  );
}
