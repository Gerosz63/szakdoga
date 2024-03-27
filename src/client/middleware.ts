import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { authRoutes, apiAuthPrefix, defaultLoginRedirect, publicRoutes } from "./app/lib/definitions";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
     const { nextUrl } = req;
     const isLoggedIn = !!req.auth;

     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
     const isAuthRoute = authRoutes.includes(nextUrl.pathname);


     if (isApiAuthRoute) return null;

     if (isAuthRoute) {
          if (isLoggedIn) {
               return Response.redirect(new URL(defaultLoginRedirect, nextUrl));
          }
     }
     if (!isLoggedIn && !isPublicRoute) {
          return Response.redirect(new URL("/login", nextUrl));
     }
});

export const config = {
     matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"]
};