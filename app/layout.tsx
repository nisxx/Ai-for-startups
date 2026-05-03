import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI for Startups | Mentorship & Scaling",
  description: "High-end AI mentorship, bootcamps, and scaling for startups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-background text-foreground">
        <div className="bg-noise fixed pointer-events-none"></div>
        <div className="flex h-[100dvh] w-screen overflow-hidden bg-black text-white">
          
          {/* Left Channel */}
          <aside className="hidden md:flex w-[60px] h-full border-r border-white/10 flex-col items-center justify-end pb-12 shrink-0 z-50 bg-black">
            <div className="flex flex-col items-center gap-6">
              <span className="text-vertical text-xs uppercase tracking-widest text-white/50" style={{ writingMode: 'vertical-rl' }}>
                SCROLL
              </span>
              <div className="w-[1px] h-24 bg-white/20"></div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 h-full relative overflow-hidden bg-black">
            {children}
          </main>
          
          {/* Right Channel */}
          <div className="hidden md:flex w-[60px] h-full border-l border-white/10 flex-col justify-end items-center pb-12 relative shrink-0 z-50">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScHpOhMzKxRPa5NyxCMXGH_3wfBcFBcIOsQ5PrC3e0b7JMFjg/viewform" 
              target="_blank"
              rel="noreferrer"
              className="-rotate-90 tracking-[0.2em] text-[10px] uppercase font-bold text-white hover:text-blue-400 transition-colors cursor-pointer origin-center whitespace-nowrap"
            >
              APPLY NOW
            </a>
          </div>

        </div>
      </body>
    </html>
  );
}
