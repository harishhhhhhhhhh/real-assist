'use client'

import { UploadIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface FilePickerProps {
  className?: string;
  setSelectedFiles: (files: File[]) => void
}

const PdfFilePicker = ({ setSelectedFiles, className }: FilePickerProps) => {
  const [status, setStatus] = useState('Only upload PDF files');

  const handleFiles = (files: FileList) => {
    let filesList: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type == 'application/pdf') {
        filesList.push(files[i]);
      }
    }
    setSelectedFiles(filesList);
  }

  return (
    <div className={cn(
      "flex items-center justify-center w-full",
      className
  )}>
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"></UploadIcon>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{status}</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          accept=".pdf"
          multiple={true}
          className="hidden"
          onDragOver={() => setStatus('Drop PDF files')}
          onDragLeave={() => setStatus('Only upload PDF files')}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onChange={(e) => {
            e.preventDefault();
            if (e.target.files) {
              handleFiles(e.target.files)
            }
          }} />
      </label>
    </div>
  )
}

export default PdfFilePicker