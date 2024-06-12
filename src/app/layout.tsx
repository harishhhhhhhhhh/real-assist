"use client";

import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';

import "./globals.scss";
import { 
  ROOT_PATH, 
  APPLICATION_NAME,
  UNIFIED_LOGIN_CLIENT_ID, 
  UNIFIED_LOGIN_AUTHORITY, 
} from "@/lib/constants";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

const oidcConfig: AuthProviderProps = {
  authority: UNIFIED_LOGIN_AUTHORITY,
  client_id: UNIFIED_LOGIN_CLIENT_ID,
  redirect_uri: ROOT_PATH,
  response_type: 'code',
  scope: 'openid',
  filterProtocolClaims: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: `${ROOT_PATH}/omnibar-silent-refresh.html`,
  onSigninCallback: (user: any) => {
    window.history.replaceState({}, document.title, ROOT_PATH);
    window.location = user.state || '/';
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>{APPLICATION_NAME}</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider {...oidcConfig}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
