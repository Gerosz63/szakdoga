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
     if (arg.g0) {
          if (arg.g0 < 0)
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés nem lehet 0-nál kisebb!",
                    path: ["g0"]
               });
          else if (arg.g0 > arg.gmax) {
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés nem lehet a maximális termelésnél nagyobb!",
                    path: ["g0"]
               });
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés nem lehet a maximális termelésnél nagyobb!",
                    path: ["gmax"]
               });
          }
     }
});

export const EnergyStorageSchema = z.object({
     name: z.string().max(20, "Maximum 20 karakter hosszú név adható meg!"),
     storage_min: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A minimális töltöttségi szint legalább 0!"),
     storage_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A maximális töltöttségi szint legalább 0!"),
     charge_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A maximális töltés legalább 0!"),
     discharge_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A maximális kisütés legalább 0!"),
     charge_loss: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A töltési veszteségi együttható 0.0 és 1.0 közötti érték!").max(1, "A töltési veszteségi együttható 0.0 és 1.0 közötti érték!"),
     discharge_loss: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "A töltési kisütési együttható 0.0 és 1.0 közötti érték!").max(1, "A töltési kisütési együttható 0.0 és 1.0 közötti érték!"),
     charge_cost: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     discharge_cost: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     s0: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
}).superRefine((val, ctx) => {
     if (val.storage_min > val.storage_max) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A minimális töltöttségi szint nem lehet több mint a maximális!",
               path: ["storage_min"]
          });
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A minimális töltöttségi szint nem lehet több mint a maximális!",
               path: ["storage_max"]
          });
     }
     if (val.storage_min > val.s0) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A kezdeti töltöttségi szint nem lehet kevesebb mint a minimális!",
               path: ["storage_min"]
          });
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A kezdeti töltöttségi szint nem lehet kevesebb mint a minimális!",
               path: ["s0"]
          });
     }
});

export const SolarPanelSchema = z.object({
     name: z.string().max(20, "Maximum 20 karakter hosszú név adható meg!"),
     r_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0),
     delta_r_plus_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0),
     delta_r_minus_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0),
     cost: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     r0: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).nullable(),
     shift_start: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).int("Csak egész szám adható meg!").min(0),
     exp_v: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     intval_range: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     value_at_end: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     addNoise: z.enum(["0", "1"]),
     seed: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).int("Csak egész szám adható meg!").nullable(),
}).superRefine((val, ctx) => {
     if (val.r0) {
          if (val.r0 > val.r_max) {
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés értéke nem lehet több mint a maximális!",
                    path: ["r0"]
               });
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés értéke nem lehet több mint a maximális!",
                    path: ["r_max"]
               });
          }
          if (val.r0 && val.r0 < 0)
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A kezdeti termelés értéke nem lehet kevesebb 0-nál!",
                    path: ["r0"]
               });
     }
});