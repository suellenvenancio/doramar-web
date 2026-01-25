/** @type {import('next').NextConfig} */
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  ignored: ["**/node_modules", "**/.git", "**/.next"], 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ijf2zh9mnvnk5xyb.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
}

export default nextConfig
