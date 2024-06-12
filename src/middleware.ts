import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createRemoteJWKSet, jwtVerify, errors } from "jose";

import { UNIFIED_LOGIN_AUTHORITY } from "./lib/constants";

const JWKS = createRemoteJWKSet(new URL(`${UNIFIED_LOGIN_AUTHORITY}/.well-known/openid-configuration/jwks`));

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const authHeader = requestHeaders.get('Authorization');
  const token = authHeader?.split(' ')[1];

  const { pathname } = request.nextUrl;
  if (pathname.includes("/api/") && token) {
    try {
      const { payload } = await jwtVerify(token, JWKS)
        .catch(async (error) => {
          if (error?.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
            for await (const publicKey of error) {
              return await jwtVerify(token, publicKey)
            }
            throw new errors.JWSSignatureVerificationFailed()
          }
          throw error
        })
      requestHeaders.set('userId', `${payload.userPartyId}`);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json('Unauthorized', { status: 401 })
    }
  }

  return NextResponse.next();
}