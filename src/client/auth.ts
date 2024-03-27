import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';


export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
     ...authConfig,
     providers: [
          Credentials({
               async authorize(credentials) {
                    const parsedCredentials = z
                         .object({ email: z.string().email(), password: z.string().min(6) })
                         .safeParse(credentials);

                    if (parsedCredentials.success) {
                         const { email, password } = parsedCredentials.data;
                         const user = await getUser(email);
                         if (!user) return null;
                    }

                    return null;
               },
          }),
     ],
     session: {strategy: "jwt"}
});