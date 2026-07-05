import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nguyen Hieu Kha | AI Engineer Portfolio",
  description:
    "Portfolio of Nguyen Hieu Kha, an AI Engineer specializing in NLP, Computer Vision, Generative AI, RAG, and multi-agent systems.",
  keywords: [
    "Nguyen Hieu Kha",
    "AI Engineer",
    "NLP",
    "Computer Vision",
    "Generative AI",
    "RAG",
    "Portfolio",
  ],
  authors: [{ name: "Nguyen Hieu Kha" }],
  creator: "Nguyen Hieu Kha",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Nguyen Hieu Kha | AI Engineer Portfolio",
    description:
      "AI Engineer based in Ho Chi Minh City, Vietnam. NLP, Computer Vision, Generative AI, RAG, and multi-agent systems.",
    siteName: "Nguyen Hieu Kha Portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
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
  );
}
