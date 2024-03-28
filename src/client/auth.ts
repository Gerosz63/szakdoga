import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import { compare } from 'bcrypt';
import { getUserByName } from '@/app/lib/actions';
import { adminRoute, authRoutes, defaultLoginRedirect, publicRoutes } from './app/lib/definitions';
import { getUserById } from './app/lib/actions';


export const { auth, signIn, signOut } = NextAuth({
     ...authConfig,
     providers: [
          Credentials({
               async authorize(credentials) {
                    const parsedCredentials = z
                         .object({ username: z.string(), password: z.string() })
                         .safeParse(credentials);

                    if (parsedCredentials.success) {
                         const { username, password } = parsedCredentials.data;
                         const user = await getUserByName(username);
                         if (!user.success) 
                              return null;

                         const passwordMatch = await compare(password, user.result?.password!);
                         if (passwordMatch) {
                              console.log(user.result);
                              return user.result;
                         }
                    }
                    console.log('Invalid credentials');
                    return null;
               },
          }),
     ],
     session: {strategy: "jwt"},
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
               if (isLoggedIn && isAdminRoute && auth?.user.role !== "Admin") {
                    return false;
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

               if ( token.role && session.user) {
                    session.user.role = token.role;
               }

               return session;
          },
          async jwt({ token }) {

               if (!token.sub)
                    return token;

               // Because the id is number
               const res = await getUserById(+token.sub);
               if (!res.success)
                    return token;
               token.name = res.result?.username;
               token.role = res.result?.role;


               return token;
          },
     },
});