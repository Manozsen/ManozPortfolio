import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PopupProvider from "@/components/PopupProvider";
import { getSeoSettings } from "@/lib/firestore";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://manoz-portfolio-546n.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: seo.title,
      template: "%s | Manoz",
    },
    description: seo.description,
    keywords: seo.keywords.split(",").map((k) => k.trim()),
    authors: [{ name: "Manoj Sen", url: BASE_URL }],
    creator: "Manoj Sen",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: BASE_URL,
      siteName: "Manoz Portfolio",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage
        ? [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Manoj Sen",
    url: BASE_URL,
    jobTitle: "Web Developer",
    description:
      "I build high-converting websites for creators, local businesses, and Instagram-based sellers.",
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Firebase",
    ],
    offers: {
      "@type": "Offer",
      description: "Free website demo for businesses",
      url: `${BASE_URL}/request-demo`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body>
        <AuthProvider>
          <PopupProvider />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
