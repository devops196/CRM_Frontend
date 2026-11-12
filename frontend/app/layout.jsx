import "./globals.css";

export const metadata = {
  title: "Internal CRM - Quickads.ai",
  description:
    "Internal CRM - Quickads.ai | People Operations workspace for employee directory, leave, benefits, and workflows.",
  applicationName: "Internal CRM - Quickads.ai",
  keywords: [
    "Internal CRM - Quickads.ai",
    "Quickads",
    "employee management",
    "HR operations",
    "people analytics",
  ],
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b3523",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
