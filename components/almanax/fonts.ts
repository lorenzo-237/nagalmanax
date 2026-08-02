import { Cormorant_Garamond, Lora } from "next/font/google"

export const almanaxHeadingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--am-font-heading",
})

export const almanaxBodyFont = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--am-font-body",
})
