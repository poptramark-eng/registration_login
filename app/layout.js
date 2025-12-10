import "./globals.css";

export const metadata = {
  title: "Forms with next js",
  description: "First Training",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-[#1F1F1F] bg-white min-h-screen flex flex-col">

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#1F1F1F] text-white py-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Forms with Next.js — All Rights Reserved
          </p>
        </footer>

      </body>
    </html>
  );
}
