
import type { Metadata } from "next";
import { Athiti } from "next/font/google"; // Ojuju
import "./custom.scss";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import clsx from "clsx";
const inter = Athiti({ weight: "500", subsets: ["latin"] });
//const ojuju = Ojuju({ weight: "500", subsets:["latin"] });
export const metadata: Metadata = {
     title: "OPTIMIZER",
     description: "Applikáció virtuális erőművek optimalizálására.",
};

export default async function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     const session = await auth();
     return (
          <SessionProvider session={session}>
               <html lang="hu">
                    <body className={clsx("mybg-grey", inter.className)}>{children}</body>
               </html>
          </SessionProvider>
     );
}
