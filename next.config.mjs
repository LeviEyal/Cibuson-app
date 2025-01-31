/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";
import packageJson from "./package.json" assert { type: 'json' };

const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA({
  images: {
    domains: ["img.clerk.com"],
  },
  publicRuntimeConfig: {
    version: packageJson.version,
  },
});
