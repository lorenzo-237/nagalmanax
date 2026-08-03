import { Fraunces } from "next/font/google"

/**
 * Heading-only accent font for the Almanax feature. Body text uses the
 * app's global default (Inter, loaded once in app/layout.tsx) — no need to
 * load it again here.
 */
export const almanaxHeadingFont = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--am-font-heading",
})
