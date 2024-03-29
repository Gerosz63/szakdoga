import type { NextAuthConfig } from 'next-auth';
import { adminRoute, authRoutes, defaultLoginRedirect, publicRoutes } from './app/lib/definitions';

export const authConfig = {
     pages: {
          signIn: '/login',
     },
     providers: [],
     callbacks: {
          async authorized({ auth, request: { nextUrl } }) {
               const isLoggedIn = !!auth?.user;
               
               const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
               const isAuthRoute = authRoutes.includes(nextUrl.pathname);
               const isAdminRoute = nextUrl.pathname.startsWith(adminRoute)
               if (isAuthRoute) {
                    if (isLoggedIn) {
                         return Response.redirect(new URL(defaultLoginRedirect, nextUrl));
                    }
                    return true;
               }
               if (isLoggedIn && isAdminRoute && auth?.user!.role !== "Admin") {
                    return Response.redirect(new URL(defaultLoginRedirect, nextUrl));
               }
               if (!isLoggedIn && !isPublicRoute) {
                    return false;
               }

               return true;
          },
          
     },
} satisfies NextAuthConfig;