import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import { CommonParentProps } from "@/types/global"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Waraqati",
    template: "%s | Waraqati"
  },
  description: "Assist with government paperwork training",
  publisher: "Bassel Abo Khabsa",
  keywords: ["Waraqati", "government", "paperwork", "training", "documentation"],
  creator: "Bassel Abo Khabsa",
  category: "Education",
  openGraph: {
    title: "Waraqati",
    description: "Assist with government paperwork training",
    siteName: "Waraqati",
    images: [
      {
        url: "/og-image.png", //! Needed
        width: 1200,
        height: 630,
        alt: "Waraqati Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export const RootLayout: React.FC<CommonParentProps> = ({ children }) => {
  return (
    <html lang="en" dir="ltr">
      <body className={`${poppins.variable} ${inter.variable} antialiased bg-background text-text`}>
        {children}
      </body>
    </html>
  )
}
