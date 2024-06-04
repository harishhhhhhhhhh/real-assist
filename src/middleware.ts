import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const JWT_ENCRYPTION_KEY = process.env.JWT_ENCRYPTION_KEY;
  const token = request.headers.get('Authorization');

  const { pathname } = request.nextUrl;
  if (JWT_ENCRYPTION_KEY && pathname.includes("/api/") && token) {
    try {
      const decodedToken = jwt.verify(token, JWT_ENCRYPTION_KEY);
      console.log("token:::", decodedToken);
    } catch (error) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }
  }

  return NextResponse.next();
}