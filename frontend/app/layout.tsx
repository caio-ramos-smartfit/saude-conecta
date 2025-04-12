import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SaúdeConecta - Saúde Acessível Para Todos",
  description: "Conectando pacientes com serviços médicos gratuitos e de baixo custo na sua região.",
  openGraph: {
    title: "SaúdeConecta - Saúde Acessível Para Todos",
    description: "Conectando pacientes com serviços médicos gratuitos e de baixo custo na sua região.",
    url: "https://v0-projeto-integrador-i.vercel.app/",
    siteName: "SaúdeConecta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaúdeConecta - Conectando pacientes com saúde acessível",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaúdeConecta - Saúde Acessível Para Todos",
    description: "Conectando pacientes com serviços médicos gratuitos e de baixo custo na sua região.",
    images: ["/og-image.png"],
    creator: "@saudeconecta",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Adicionando meta tags extras para garantir compatibilidade com diferentes plataformas */}
        <meta property="og:title" content="SaúdeConecta - Saúde Acessível Para Todos" />
        <meta
          property="og:description"
          content="Conectando pacientes com serviços médicos gratuitos e de baixo custo na sua região."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://v0-projeto-integrador-i.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
