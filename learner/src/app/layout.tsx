import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreativeTutor AI',
  description: 'AI-powered courses to ignite your creativity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleOneTap />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
    
  )
}

