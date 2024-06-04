'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction, useState, DragEvent } from "react"

interface FilePickerProps {
  setSelectedFile: Dispatch<SetStateAction<File | null>>
}

const FilePicker: React.FC<FilePickerProps> = ({
  setSelectedFile,
}) => {
  const [status, setStatus] = useState("");

  const handleFileDrop = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file: File = e.dataTransfer.files[0]
    if (file.type == 'application/pdf') {
      setSelectedFile(file)
    } else {
      setStatus("Drop PDFs only")
    }
  }

  return (
    <div
      className='flex flex-col gap-7 justify-center items-center h-[80vh]'>
      <Label htmlFor="pdf" className="text-xl font-bold tracking-tight text-gray-600 cursor-pointer">
        Select PDF to chat
      </Label>
      <Input
        onDragOver={() => setStatus("Drop PDF file to chat")}
        onDragLeave={() => setStatus("")}
        onDrop={handleFileDrop}
        id="pdf"
        type="file"
        accept='.pdf'
        className="cursor-pointer"
        onChange={(e) => {
          if (e.target.files) {
            setSelectedFile(e.target.files[0])
          }
        }}
      />
      <div className="text-lg font-medium">{status}</div>
    </div>
  )
}

export default FilePicker
