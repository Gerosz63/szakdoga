import NextAuth, { type DefaultSession } from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { compare } from 'bcrypt';
import { getUserByName } from '@/app/lib/actions';
import { getUserById } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions'

declare module "next-auth" {
     interface User {
          role: "admin" | "user",
          theme: "dark" | "light"
     }
     interface Session {
          user: {
               role: "admin" | "user",
               theme: "dark" | "light"
          } & DefaultSession["user"]
     }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
     ...authConfig,
     providers: [
          Credentials({
               async authorize(credentials): Promise<any> {

                    const parsedCredentials = z
                         .object({ username: z.string(), password: z.string() })
                         .safeParse(credentials);

                    if (parsedCredentials.success) {
                         const { username, password } = parsedCredentials.data;
                         const user = await getUserByName(username);
                         if (!user.success && user.result === 0)
                              throw new Error("Adatbázis hiba!");
                         else if (!user.success && user.result === 1)
                              return null;
                         const passwordMatch = await compare(password, (user.result as User).password!);
                         if (passwordMatch) {
                              console.log(user.result);
                              return user.result;
                         }
                    }
                    return null;
               },
          }),
     ],
     session: { strategy: "jwt" },
     callbacks: {
          async jwt({ token }) {

               if (!token.sub)
                    return token;

               // Because the id is number
               const res = await getUserById(+token.sub);
               if (!res.success)
                    return token;
               token.name = res.result?.username;
               token.role = res.result?.role;
               token.theme = res.result?.theme;

               return token;
          },
          async session({ token, session }) {

               if (token.sub && session.user) {
                    session.user.id = token.sub;
               }
               if (token.role && session.user) {
                    session.user.role = token.role as "admin" | "user";
               }
               if (token.theme && session.user) {
                    session.user.theme = token.theme as "dark" | "light";
               }
               return session;
          },
     }
});