import { NextResponse } from "next/server";
import { readdirSync, statSync } from "fs";
import { resolve } from "path";

import { FileInfo } from "../../../models/FileInfo";

const DIRECTORY_PATH = 'src/data';

export async function GET(req: Request) {
  let files: FileInfo[] = [];
  readdirSync(DIRECTORY_PATH).forEach(fileName => {
    const filePath = resolve(DIRECTORY_PATH, fileName);
    const stats = statSync(filePath);
    files.push({
      fileName,
      filePath,
      lastUpdatedTime: stats.atime.getTime(),
      deleteIndicator: false,
    })
  });
  return NextResponse.json(files, { status: 200 });
}


/* export async function POST(req: Request) {

} */

export async function DELETE(req: Request) {

}