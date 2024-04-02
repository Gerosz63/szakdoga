"use client";

import Navbar from "@/app/ui/navbar";
import { useEffect } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {
     useEffect(() => {
          require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }, []);
 
     return (
          <main>
               <Navbar />
               <div>{children}</div>
          </main>
     );
}