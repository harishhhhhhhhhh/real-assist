import { NextRequest } from "next/server";

export interface ApiRequest extends NextRequest {
    userId: number;
}