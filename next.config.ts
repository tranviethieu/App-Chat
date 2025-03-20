import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //target: "serverless",
  trailingSlash: true, // Thêm dấu / ở cuối URL, Firebase Hosting yêu cầu điều này
};

export default nextConfig;
