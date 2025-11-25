import type { Metadata } from "next";
import "@/src/app/globals.css";

export const metadata: Metadata = {
  title: "Food Roulette",
  description: "Feeling indecisive? Let fate decide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans text-gray-900">
        {children}
      </body>
    </html>
  );
}
