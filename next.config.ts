import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',               // <--- Tambahin ini
  images: { unoptimized: true },  // <--- Tambahin ini biar gambar gak error
};

export default nextConfig;
