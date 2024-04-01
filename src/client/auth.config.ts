import type { NextAuthConfig } from 'next-auth';
import { adminRoute, apiAuthRoute, authRoutes, defaultLoginRedirect, publicRoutes } from './app/lib/definitions';
import { getUserById } from './app/lib/actions';


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
               const isAdminRoute = nextUrl.pathname.startsWith(adminRoute);
               const isApiAuthroute = nextUrl.pathname.startsWith(apiAuthRoute);


               if (isAuthRoute) {
                    if (isLoggedIn) {
                         return Response.redirect(new URL(defaultLoginRedirect, nextUrl));
                    }
                    return true;
               }

               if (isApiAuthroute) {
                    return true;
               }

               if (isLoggedIn && isAdminRoute && auth?.user!.role !== "admin") {
                    return Response.redirect(new URL(defaultLoginRedirect, nextUrl));
               }


               if (!isLoggedIn && !isPublicRoute) {
                    return false;
               }

               return true;
          },
          async session({ token, session }) {

               if (token.sub && session.user) {
                    session.user.id = token.sub;
               }
               if (token.role && session.user) {
                    session.user.role = token.role as "admin" | "user";

               }

               return session;
          },
     },
} satisfies NextAuthConfig;