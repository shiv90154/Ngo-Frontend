// app/layout.js
import ClientProvider from "./ClientProvider";
import "./globals.css";

export const metadata = {
  title: "Samraddh Bharat Foundation",
  description: "Digital India initiative",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" defer />
      </head>
      <body suppressHydrationWarning>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}