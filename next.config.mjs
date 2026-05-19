const isPagesBuild = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isPagesBuild ? "export" : undefined,
  basePath: isPagesBuild ? "/calc" : undefined,
  assetPrefix: isPagesBuild ? "/calc/" : undefined,
  trailingSlash: isPagesBuild ? true : undefined,
};

export default nextConfig;
