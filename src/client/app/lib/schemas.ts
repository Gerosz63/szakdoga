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


export const GasEngineSchema = z.object({
     name: z.string().max(20, "Maximum 20 karakter hosszú név adható meg!"),
     gmax: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A Maximális termelésnek legalább 0-nak kell lennie!"),
     gplusmax: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A Maximális felfutási ráta legalább 0-nak kell lennie!"),
     gminusmax: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A Maximális lefutási ráta legalább 0-nak kell lennie!"),
     cost: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     g0: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).nullable()
}).superRefine((arg, ctx) => {
     if (arg.g0 || arg.g0 === 0) {
          if (arg.g0 < 0)
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés nem lehet 0-nál kisebb!",
                    path: ["g0"]
               });
          else if (arg.g0 > arg.gmax)
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés nem lehet a maximális termelésnél nagyobb!",
                    path: ["g0"]
               });
     }
});