import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Required for static export — disables Next.js built-in image optimization
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
