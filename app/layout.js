import ClientProvider from "./ClientProvider";
import "./globals.css";

export const metadata = {
  title: "Samraddh Bharat Foundation",
  description: "Digital India initiative - Education, Healthcare, Agriculture, Finance & more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}