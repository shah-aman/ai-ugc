import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Header } from "@/components/ui/header";
import { cookies } from "next/headers";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalProviders } from "./providers";
// import { createServerClient } from '@supabase/ssr';

export const metadata: Metadata = {
  title: "Supernova",
  description: "High quality UGC for your brand",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const SIDEBAR_STATE_COOKIE = "sidebar:state";

// const queryClient = new QueryClient();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session server-side
  const cookieStore = await cookies();
  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       get(name: string) {
  //         return cookieStore.get(name)?.value;
  //       },
  //     },
  //   }
  // );

  // const { data: { session } } = await supabase.auth.getSession();

  const sidebarState = cookieStore.get(SIDEBAR_STATE_COOKIE)?.value === "true";

  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`dark:bg-background dark:text-white`}>
        <GlobalProviders>
          <SidebarProvider defaultOpen={sidebarState}>
            <div className="flex h-screen w-[100%]">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden w-[100%]">
                <div className="h-16 shrink-0">
                  <Header />
                </div>
                <main className="flex-1 overflow-auto w-[100%] font-sans antialiased">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </GlobalProviders>
      </body>
    </html>
  );
}
