import "./globals.css";
import AppSidebar from "@/components/layout/Sidebar";
import Providers from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            <div className="w-64 border-r bg-gradient-to-b from-slate-50 to-slate-100/50">
              <AppSidebar />
            </div>
            <main className="flex-1 flex justify-center bg-gradient-to-br from-slate-50 to-white">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}