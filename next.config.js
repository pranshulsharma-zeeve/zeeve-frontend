/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
// We do not use Next.js basePath so that auth pages live under /auth (not /platform/auth).
const BASE_PATH = undefined;
const buildContentSecurityPolicy = () => {
  const isDev = process.env.NODE_ENV !== "production";
  const allowUnsafeEval = true;
  const allowWasmUnsafeEval = true;
  const devConnectSrc = isDev ? " http://localhost:8069 http://127.0.0.1:8069" : "";
  return `
default-src 'self' 'unsafe-inline' https://salesiq.zohopublic.com https://static.zohocdn.com data: https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.co.in;
connect-src 'self' https://none8833.zendesk.com https://salesiq.zohopublic.com https://www.google-analytics.com https://client.crisp.chat https://api.crisp.chat https://client.relay.crisp.chat https://client.relay.rescue.crisp.chat wss://client.crisp.chat wss://client.relay.crisp.chat wss://client.relay.rescue.crisp.chat https://vision-backend-test.zeeve.net https://vizion.backend.zeeve.net https://rpc.testcosmos.directory https://rpc.cosmos.directory https://rest.testcosmos.directory https://rest.cosmos.directory https://raw.githubusercontent.com https://*.zeeve.net https://*.zeeve.io https://www.google.com https://www.gstatic.com wss://*.zeeve.net${devConnectSrc};
script-src 'self' 'unsafe-inline'${allowUnsafeEval ? " 'unsafe-eval'" : ""}${allowWasmUnsafeEval ? " 'wasm-unsafe-eval'" : ""} https://cdn.jsdelivr.net https://salesiq.zoho.com https://salesiq.zohopublic.com https://static.zohocdn.com https://js.zohocdn.com https://js.zohostatic.com https://client.crisp.chat https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.co.in https://www.gstatic.com https://vision-frontend-test.zeeve.net https://vizion.zeeve.net https://*.zeeve.net https://*.zeeve.io;
style-src 'self' 'unsafe-inline' https://static.zohocdn.com https://css.zohocdn.com https://css.zohostatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://client.crisp.chat;
font-src 'self' data: https://cdnjs.cloudflare.com https://css.zohocdn.com https://js.zohocdn.com https://client.crisp.chat;
img-src 'self' data: https://salesiq.zoho.com https://css.zohocdn.com https://js.zohocdn.com https://client.crisp.chat https://image.crisp.chat http://odoo-dev.zeeve.net https://odoo-dev.zeeve.net http://backend.zeeve.net  http://api.zeeve.io https://api.zeeve.io https://backend.zeeve.net https://www.gstatic.com https://keybase.io https://*.cloudfront.net https://s3.amazonaws.com;
frame-src 'self' https://salesiq.zoho.com https://client.crisp.chat https://plugins.crisp.chat https://vision-frontend-test.zeeve.net https://vizion.zeeve.net https://www.google.com https://www.gstatic.com https://calendly.com https://*.calendly.com;
frame-ancestors 'self' https://vision-frontend-test.zeeve.net https://vizion.zeeve.net;
`.replace(/\n/g, "");
};

const getSharedConfig = () => {
  const config = {
    output: "standalone",
    images: {
      // ✅ Allow Odoo images (any path under /web/image/* and plain domain)
      domains: ["odoo-dev.zeeve.net", "backend.zeeve.net", "api.zeeve.io"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "odoo-dev.zeeve.net",
          port: "",
          pathname: "/web/image/**",
        },
        {
          protocol: "http",
          hostname: "odoo-dev.zeeve.net",
          port: "",
          pathname: "/web/image/**",
        },
        {
          protocol: "https",
          hostname: "api.zeeve.io",
          port: "",
          pathname: "/web/image/**",
        },
        {
          protocol: "http",
          hostname: "api.zeeve.io",
          port: "",
          pathname: "/web/image/**",
        },
      ],
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: buildContentSecurityPolicy(),
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-Frame-Options",
              value: "SAMEORIGIN",
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block",
            },
            {
              key: "Strict-Transport-Security",
              value: "max-age=31536000; includeSubDomains; always",
            },
          ],
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: "/platform",
          destination: "/",
        },
        {
          source: "/platform/:path*",
          destination: "/:path*",
        },
      ];
    },
    async redirects() {
      return [
        {
          source: "/platform/auth",
          destination: "/auth",
          permanent: true,
        },
        {
          source: "/platform/auth/:path*",
          destination: "/auth/:path*",
          permanent: true,
        },
        // Ensure unified rollup links still reach Orbit's original pages/design
        {
          source: "/rollups/arbitrum-orbit",
          destination: "/arbitrum-orbit",
          permanent: false,
        },
        {
          source: "/rollups/arbitrum-orbit/:path*",
          destination: "/arbitrum-orbit/:path*",
          permanent: false,
        },
        // Redirect platform Orbit paths to native Orbit routes (update URL)
        {
          source: "/platform/arbitrum-orbit",
          destination: "/arbitrum-orbit",
          permanent: false,
        },
        {
          source: "/platform/arbitrum-orbit/:path*",
          destination: "/arbitrum-orbit/:path*",
          permanent: false,
        },
      ];
    },
  };
  // Intentionally avoid basePath so /auth/* stays at the root.
  return config;
};
const sharedConfig = getSharedConfig();
const nextConfig = {
  ...sharedConfig,
  eslint: {
    // Do not fail the production build on ESLint warnings
    ignoreDuringBuilds: true,
  },
  async headers() {
    return sharedConfig.headers();
  },
  async rewrites() {
    return sharedConfig.rewrites();
  },
  async redirects() {
    return sharedConfig.redirects();
  },
};
module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...sharedConfig,
    };
  }
  return nextConfig;
};
