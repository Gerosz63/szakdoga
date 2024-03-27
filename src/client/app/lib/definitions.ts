import { z } from "zod";
import { getUserById, isUserExists } from "./actions";

export type User = {
     id?: number,
     username: string,
     password?: string,
     role: "admin" | "user",
     theme?: "dark" | "light"
};
export type DbActionResult<T> = {
     success: boolean,
     result: T | null,
     message?: string
};
export type State = {
     errors?: {
          username?: string[];
          password?: string[];
          password_rep?: string[];
          role?: string[];
          theme?: string[];
          general?: string[];
     };
     message?: string | null;
};

export const FormModifySchema = z.object({
     id: z.number(),
     username: z.string(),
     password: z.string().nullable(),
     role: z.enum(["admin", "user"]),
}).superRefine(async (val, ctx) => {
     const userId = await isUserExists(val.id);
     if (!userId.success || !userId.result) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A módosítandó felhasználó nem létezik!",
               path: ["id"]
          })
     }
     else {
          const user = await getUserById(val.id);
          const userExists = await isUserExists(val.username);
          if (!user.success || !userExists.success || (user.result!.username != val.username && userExists.result)) {
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A felhasználónév már foglalat",
                    path: ["username"]
               });
          }
     }
});

export const FormSchema = z.object({
     username: z.string(),
     password: z.string(),
     password_rep: z.string(),
     role: z.enum(["admin", "user"]),
}).superRefine(async (data, ctx) => {
     if (data.password !== data.password_rep) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A jelszavak nem egyeznek!",
               path: ["password_rep"]
          });
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: " ",
               path: ["password"]
          });
     }
     const user = await isUserExists(data.username);
     if (!user.success || user.result) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A felhasználónév már foglalat",
               path: ["username"]
          });
     }
});

export const publicRoutes = [
     "/",
];

export const authRoutes = [
     "/login",
];

export const apiAuthPrefix = "/api/auth";

export const defaultLoginRedirect = "/home";