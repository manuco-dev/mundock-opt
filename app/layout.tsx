import type React from "react"
import type { Metadata } from "next"
import {
  Playfair_Display,
  Lora,
} from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

export const metadata: Metadata = {
  title: "Mundo Vacacional - Tu Escape Perfecto Te Espera",
  description:
    "Descubre apartamentos únicos y transporte confiable para unas vacaciones inolvidables con Mundo Vacacional.",
  generator: "v0.app",
  icons: {
    icon: "/favi.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${playfairDisplay.variable} ${lora.variable}`}
    >
      <head></head>
      <body>{children}</body>
    </html>
  )
}
