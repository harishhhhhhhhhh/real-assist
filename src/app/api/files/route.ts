import { NextRequest, NextResponse } from "next/server";
import { statSync, writeFileSync, unlinkSync, readdirSync } from "fs";
import { resolve } from "path";

import { FileInfo } from "@/models/FileInfo";
import processDocsStore from "@/lib/processDocs";

const DIRECTORY_PATH = 'src/data';

export async function GET(req: NextRequest) {
  let files: FileInfo[] = [];
  readdirSync(DIRECTORY_PATH).forEach(fileName => {
    const filePath = resolve(DIRECTORY_PATH, fileName);
    const stats = statSync(filePath);
    files.push({
      fileName,
      filePath,
      lastUpdatedTime: stats.atime.getTime(),
      loading: false,
    })
  });
  return NextResponse.json(files, { status: 200 });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.values();
  let filesList: FileInfo[] = [];
  for (const value of files) {
    const file = value as Blob;
    const fileName = (value as File).name;
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(`${DIRECTORY_PATH}/${fileName}`, buffer);
    const stats = statSync(`${DIRECTORY_PATH}/${fileName}`);
    filesList.push({
      fileName,
      filePath: resolve(`${DIRECTORY_PATH}/${fileName}`),
      lastUpdatedTime: stats.atime.getTime(),
      loading: false,
    })
  }
  return NextResponse.json(filesList, { status: 200 });
}

export async function PUT(req: NextRequest) {
  await processDocsStore(true);
  return new Response(null, { status: 204 });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const fileName = searchParams.get('fileName');
  const filePath = resolve(`${DIRECTORY_PATH}/${fileName}`);
  unlinkSync(filePath);
  return new Response(null, { status: 204 });
}