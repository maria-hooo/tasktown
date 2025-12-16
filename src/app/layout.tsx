import "./globals.css";
import Providers from "@/components/session-provider";

export const metadata = {
  title: "TaskTown",
  description: "A tiny full-stack tasks app (Next.js + Auth + Prisma)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
