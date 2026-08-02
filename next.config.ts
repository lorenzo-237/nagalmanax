import type { NextConfig } from "next"

// Project pages are served at https://<owner>.github.io/<repo>/, so every
// asset URL needs the repo name prefixed. GITHUB_REPOSITORY ("owner/repo")
// is set automatically by GitHub Actions, so this only kicks in in CI —
// `npm run dev` / a local `npm run build` are unaffected.
const isGithubActions = process.env.GITHUB_ACTIONS === "true"
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1]
const basePath = isGithubActions && repoName ? `/${repoName}` : ""

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
}

export default nextConfig
