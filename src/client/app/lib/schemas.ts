import { z } from "zod";
import { getUserById, isUserExists } from "./actions";

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