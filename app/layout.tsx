import '@/app/ui/global.css'; // Import global CSS styles
import { poppins } from "./ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` bg-black antialiased`}>{children}</body>
    </html>
  );
}
