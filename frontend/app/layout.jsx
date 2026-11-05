import "./globals.css";

export const metadata = {
  title: "Internal CRM Pro | People Operations",
  description:
    "A premium people operations workspace for employee records, leave, benefits, workflows, and insights.",
  applicationName: "Internal CRM Pro",
  keywords: [
    "internal CRM",
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
