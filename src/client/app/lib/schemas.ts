import { z } from "zod";
import { getUserById, isUserExists } from "@/app/lib/actions";

/**
 * Validation schema for modifing user
 */
export const FormModifySchema = z.object({
     id: z.number(),
     username: z.string().max(20, "A felhasználónév hossza nem haladhatja meg a 20 karaktert!"),
     password: z.string().min(6, "A jelszónak legalább 6 kerekter hosszúnak kell lennie!").nullable(),
     role: z.enum(["admin", "user"]).nullable(),
}).superRefine(async (val, ctx) => {
     const userId = await isUserExists(val.id);
     if (userId.success && !userId.result) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A módosítandó felhasználó nem létezik!",
               path: ["id"]
          })
     }
     else {
          const user = await getUserById(val.id);
          const userExists = await isUserExists(val.username);
          if (user.success && userExists.success && (user.result!.username != val.username && userExists.result)) {
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A felhasználónév már foglalat",
                    path: ["username"]
               });
          }
     }
});

/**
 * Validation schema for adding new user
 */
export const FormSchema = z.object({
     username: z.string().max(20, "A felhasználónév hossza nem haladhatja meg a 20 karaktert!"),
     password: z.string().min(6, "A jelszónak legalább 6 kerekter hosszúnak kell lennie!"),
     password_rep: z.string().min(6, "A jelszónak legalább 6 kerekter hosszúnak kell lennie!"),
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
     if (user.success && user.result) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A felhasználónév már foglalat",
               path: ["username"]
          });
     }
});

/**
 * validation schema for gas engines
 */
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

/**
 * Validation schema for energy storages
 */
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

/**
 * Validation schema for Solar panels
 */
export const SolarPanelSchema = z.object({
     name: z.string().max(20, "Maximum 20 karakter hosszú név adható meg!"),
     r_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "Csak 0 vagy annál nagyobb szám adható meg!"),
     delta_r_plus_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "Csak 0 vagy annál nagyobb szám adható meg!"),
     delta_r_minus_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "Csak 0 vagy annál nagyobb szám adható meg!"),
     cost: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     r0: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).nullable(),
     shift_start: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).int("Csak egész szám adható meg!").min(0, "Csak 0 vagy annál nagyobb szám adható meg!"),
     exp_v: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     intval_range: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).gte(0, "Csak 0-nál nagyobb érték adható meg."),
     value_at_end: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).gte(0, "Csak 0-nál nagyobb érték adható meg.").max(0.1, "A megadott érték nem haladhatja meg a 0.1-et!"),
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


/**
 * The solar panel maximum production chart query schema.
 */
export const solarDataSchema = z.object({
     T: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).int("Csak egész szám adható meg!").min(1, "Csak 0-nál nagyobb szám adható meg!"),
     value_at_end: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).superRefine((val, ctx) => {
          if (val <= 0 || val >= 0.1)
               ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Az értéknek 0 és 0.1 közöttinek kell lennie!",
                    path: ["value_at_end"]
               });
     }),
     intval_range: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).gt(0, "Csak 0-nál nagyobb szám adható meg!"),
     exp_v: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }),
     shift_start: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).int("Csak egész szám adható meg!"),
     r_max: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).min(0, "Csak 0 vagy annál nagyobb szám adható meg!"),
     addNoise: z.boolean(),
     seed: z.coerce.number({ invalid_type_error: "Csak szám adható meg!" }).int("Csak egész szám adható meg!").nullable()
}).superRefine((val, ctx) => {
     if (val.T && val.shift_start && val.T < val.shift_start){
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "Az időintervallumok számánál az eltolás nem lehet nagyobb!",
               path: ["T"]
          });
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "Az időintervallumok számánál az eltolás nem lehet nagyobb!",
               path: ["shift_start"]
          });
     }
          
});