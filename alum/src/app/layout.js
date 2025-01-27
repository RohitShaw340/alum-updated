import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import LoggedIn from "./loggedIn";
import Navigation from "./navigation";
import Footer from "./footer";
import Update from "./update";

export const metadata = {
  manifest: `${process.env.LINK}manifest.json`,
  title: {
    default: "Alum",
    template: "%s | Alum",
  },
  description:
    "Welcome to Alum, the exclusive platform connecting NSUT students and alumni. Discover networking opportunities, mentorship, job offers, internships, and more while staying engaged with the NSUT community.",
  generator: "Alum",
  applicationName: "Alum",
  referrer: "origin-when-cross-origin",
  keywords: ["Alum", "NSUT", "NSIT", "Alumni"],
  openGraph: {
    title: {
      default: "Alum",
      template: "%s | Alum",
    },
    description:
      "Welcome to Alum, the exclusive platform connecting NSUT students and alumni. Discover networking opportunities, mentorship, job offers, internships, and more while staying engaged with the NSUT community.",
    url: process.env.LINK,
    siteName: "Alum",
    images: [
      {
        url: `${process.env.LINK}logo-background.png`,
        width: 250,
        height: 250,
        alt: "Alum - NSUT Alumni Network Logo",
      },
      {
        url: `${process.env.LINK}logo.png`,
        width: 250,
        height: 193,
        alt: "Alum - NSUT Alumni Network Logo",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    apple: [
      { url: "/logo.png", sizes: "250x193", type: "image/png" },
      { url: "/logo-background.png", sizes: "250x250", type: "image/png" },
    ],
  },
  themeColor: "white",
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Alum",
      template: "%s | Alum",
    },
    description:
      "Welcome to Alum, the exclusive platform connecting NSUT students and alumni. Discover networking opportunities, mentorship, job offers, internships, and more while staying engaged with the NSUT community.",
    siteId: "1643623396696006658",
    creator: "@alumninet_in",
    creatorId: "1643623396696006658",
    images: [
      `${process.env.LINK}logo-background.png`,
      `${process.env.LINK}logo.png`,
    ],
  },
};

export default function RootLayout({ children }) {
  const status = LoggedIn();
  return (
    <html lang="en">
      <head />
      <body>
        <Navigation
          data={status}
          keys={[process.env.ALGOLIA_MAIN, process.env.ALGOLIA_SEARCH]}
          LINK={process.env.LINK}
        ></Navigation>
        <div className="nav-gap"></div>
        <Analytics />
        {status.loggedIn && (
          <Update email={status.data.email} oldData={status.data}></Update>
        )}
        <main className="min-h-[calc(100vh-80px)]">{children}</main>
        <Footer data={status}></Footer>
      </body>
    </html>
  );
}
