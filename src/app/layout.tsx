import "./globals.css";
import { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import ConfigProvider from "@/providers/config-provider";
import LayoutProvider from "@/providers/layout-provider";
import { withBasePath } from "@/utils/helpers";
import AxiosProvider from "@/providers/axios-provider";
import AuthProvider from "@/providers/auth-provider";
import { dmSans, poppins } from "@/utils/font";
import { ApolloProvider } from "@/providers/apollo-provider";
import ToastProvider from "@/providers/toast-provider";
import { getConfig } from "@/config";
import ModalProvider from "@/providers/layout-provider/modal-provider";
import CrispChat from "@/components/crisp-chat";

export const metadata: Metadata = {
  title: {
    default: "Platform | Zeeve",
    template: "%s | Platform | Zeeve",
  },
  description: "",
};

const themeInitScript = `
  (function () {
    try {
      var storedTheme = localStorage.getItem("theme");
      var theme =
        storedTheme === "dark"
          ? "dark-blue"
          : storedTheme === "light" || storedTheme === "dark-blue" || storedTheme === "black" || storedTheme === "gray"
            ? storedTheme
            : "light";
      var root = document.documentElement;
      var isDark = theme === "dark-blue" || theme === "black";
      var isBlack = theme === "black";
      var isGray = theme === "gray";
      root.classList.toggle("dark", isDark);
      root.classList.toggle("theme-black", isBlack);
      root.classList.toggle("theme-gray", isGray);
      root.style.colorScheme = isDark ? "dark" : "light";
    } catch (err) {
      // no-op
    }
  })();
`;

/** Root layout of the application. */
const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const config = await getConfig();
  const iframeScriptOrigin = process.env.NEXT_PUBLIC_IFRAME_SCRIPT_ORIGIN;
  const shouldLoadIframeScript = typeof iframeScriptOrigin === "string" && iframeScriptOrigin.trim().length > 0;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {shouldLoadIframeScript ? <Script src={iframeScriptOrigin} strategy="beforeInteractive" /> : null}
        {/* Google Tag Manager */}
        <Script id="gtm-bootstrap" strategy="afterInteractive">
          {`
            if (window.location.hostname === 'app.zeeve.io') {
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KMMVTKT');
            }
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <link rel="shortcut icon" href={withBasePath("/favicon.ico")} />
      <body className={`${dmSans.variable} ${poppins.variable} font-poppins`}>
        <Suspense fallback={null}>
          <CrispChat />
        </Suspense>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KMMVTKT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ConfigProvider config={config}>
          <AxiosProvider
            backendAxiosRequestConfig={{
              baseURL: config.url?.internal?.backend,
            }}
          >
            <ApolloProvider>
              <ToastProvider>
                <AuthProvider
                  backendURL={config.url?.external?.auth?.backend ?? ""}
                  frontendURL={config.url?.external?.auth?.frontend ?? ""}
                >
                  <ModalProvider />
                  <LayoutProvider>{children}</LayoutProvider>
                </AuthProvider>
              </ToastProvider>
            </ApolloProvider>
          </AxiosProvider>
        </ConfigProvider>
      </body>
    </html>
  );
};

export default RootLayout;
