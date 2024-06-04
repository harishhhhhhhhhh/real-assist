"use client";

import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';

import "./globals.scss";
import { ROOT_PATH } from "@/lib/constants";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

const oidcConfig: AuthProviderProps = {
  authority: "https://www-dev.realpage.com/login/identity",
  client_id: "RealAssistUI",
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
