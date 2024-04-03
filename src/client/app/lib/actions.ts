"use server";
import { revalidatePath } from "next/cache";
import { exec_query } from "@/app/lib/db";
import { DbActionResult, UserState, User, GasEngineState, SolarPanel, GasEngine, EnergyStorage, DbNameExchange, EnergyStorageState, SolarPanelState } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { FormModifySchema, FormSchema, GasEngineSchema, EnergyStorageSchema, SolarPanelSchema} from "@/app/lib/schemas";
import { escape } from "mysql2";


export async function addUser(prevState: UserState, formData: FormData) {
     const dataValidated = await FormSchema.safeParseAsync({
          username: formData.get("username"),
          password: formData.get("password"),
          password_rep: formData.get("password_rep"),
          role: formData.get("role")
     });

     if (!dataValidated.success) {
          console.log("Invalid data:")
          console.log(dataValidated.error.flatten().fieldErrors)
          return {
               errors: dataValidated.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }

     const data = dataValidated.data;
     const qstr = `INSERT INTO user (username, password, role) VALUES (${escape(data.username)}, '${await hash(data.password, 10)}', ${escape(data.role)});`;
     const res = await exec_query(qstr);
     if (!res.success) {
          console.log(res?.message);
          return { errors: { "general": ["Adatbázis hiba!"] }, message: "Adatbázis hiba! A felhasználó hozzáadása sikertelen!" };
     }
     revalidatePath('/usermanager');
     redirect('/usermanager');
}
export async function modifyUser(id: number, prevState: UserState, formData: FormData) {
     const dataValidated = await FormModifySchema.safeParseAsync({
          id: id,
          username: formData.get("username"),
          password: formData.get("passworld"),
          role: formData.get("role")
     });
     if (!dataValidated.success) {
          console.log("Invalid data:")
          console.log(dataValidated.error.flatten().fieldErrors)
          return {
               errors: dataValidated.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }
     const data = dataValidated.data;
     const q = `UPDATE user SET username = ${escape(data.username)}${data.password !== null ? ", password = '" + hash(data.password, 10) + "'" : ""}, role = ${escape(data.role)} WHERE id = ${id};`;
     const res = await exec_query(q);
     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba! A felhasználó módosítása sikertelen!" };
     }
     revalidatePath('/usermanager');
     redirect('/usermanager');
}

export async function removeUser(id: number) {
     const q = `DELETE FROM user WHERE id = ${id};`;
     const res = await exec_query(q);
     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba. A felhasználó nem törölhető!" };
     }

     revalidatePath('/usermanager');
}


export async function isUserExists(userId: string | number) {
     const q = `SELECT id FROM user WHERE ${typeof userId == "number" ? "id = " + userId : "username = " + escape(userId)}`;
     const res = await exec_query(q);
     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba.", success: false, result: null } as DbActionResult<null>;
     }
     return { result: res.result?.length != 0, success: true } as DbActionResult<boolean>;
}


export async function listUsers(search: string = "", page: number = 1, limit: number = 10) {
     const q = `SELECT id, username, role, theme FROM user${search && " WHERE username LIKE '%" + escape(search).substring(1, escape(search).length - 1) + "%'"} LIMIT ${(page - 1) * 10},${limit};`;
     const res = await exec_query(q);

     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba.", success: false, result: null } as DbActionResult<null>;
     }
     return { success: true, result: res.result as Array<User> } as DbActionResult<[User]>;
}

export async function getUserById(id: number) {

     const q = await `SELECT username, role FROM user WHERE id = ${id};`;
     const res = await exec_query(q);

     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba.", success: false, result: null } as DbActionResult<null>;
     }
     else if (res.result.length == 0) {
          console.log("A felhasználó nem létezik!")
          return { message: "A felhasználó nem létezik!", success: false, result: null } as DbActionResult<null>;
     }
     return { success: true, result: res.result[0] as User } as DbActionResult<User>;
}

export async function getUserByName(name: string) {
     const q = `SELECT id, username, password, role FROM user WHERE username = ${escape(name)};`;
     const res = await exec_query(q);

     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba.", success: false, result: null } as DbActionResult<null>;
     }
     else if (res.result.length == 0) {
          console.log("A felhasználó nem létezik!")
          return { message: "A felhasználó nem létezik!", success: false, result: null } as DbActionResult<null>;
     }
     return { success: true, result: res.result[0] as User } as DbActionResult<User>;
}

export async function login(prevState: string | undefined, formData: FormData) {
     try {
          await signIn("credentials", formData)
     } catch (error) {
          if (error instanceof AuthError) {
               switch (error.type) {
                    case "CredentialsSignin":
                         return "Hibás felhasználónév vagy jelszó!";
                    default:
                         return "Hiba történt próbáld később!";
               }
          }
          throw error;
     }
}
export async function logout() {
     await signOut();
}

export async function addNewGasEngine(uid: number, prevState: GasEngineState, formData: FormData) {
     const g0 = formData.get("g0") === "" ? null : formData.get("g0");
     const validatedData = GasEngineSchema.safeParse({
          name: formData.get("genName"),
          gmax: formData.get("gmax"),
          gplusmax: formData.get("gplusmax"),
          gminusmax: formData.get("gminusmax"),
          cost: formData.get("cost"),
          g0: g0,
     });

     if (!validatedData.success) {
          console.log("Invalid data:")
          console.log(validatedData.error.flatten().fieldErrors)
          return {
               errors: validatedData.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }

     const data = validatedData.data;
     const q = `INSERT INTO gas_engines (uid, name, gmax, gplusmax, gminusmax, cost, g0) VALUES (${uid}, ${escape(data.name)}, ${data.gmax}, ${data.gplusmax}, ${data.gminusmax}, ${data.cost}, ${data.g0 === null ? 'NULL' : data.g0})`;

     const res = await exec_query(q);
     if (!res.success) {
          console.log(res.message);
          return {
               errors: { general: "Adatbázis hiba!" },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");
}

export async function modifyGasEngine(id: number, prevState: GasEngineState, formData: FormData) {
     const g0 = formData.get("g0") === "" ? null : formData.get("g0");
     const validatedData = GasEngineSchema.safeParse({
          name: formData.get("genName"),
          gmax: formData.get("gmax"),
          gplusmax: formData.get("gplusmax"),
          gminusmax: formData.get("gminusmax"),
          cost: formData.get("cost"),
          g0: g0,
     });

     if (!validatedData.success) {
          console.log("Invalid data:")
          console.log(validatedData.error.flatten().fieldErrors)
          return {
               errors: validatedData.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }

     const data = validatedData.data;
     const q = `UPDATE gas_engines SET name = ${escape(data.name)}, gmax = ${data.gmax}, gplusmax = ${data.gplusmax}, gminusmax = ${data.gminusmax}, cost = ${data.cost}, g0 = ${data.g0 === null ? 'NULL' : data.g0} WHERE id = ${id};`;

     const res = await exec_query(q);
     if (!res.success) {
          console.log(res.message);
          return {
               errors: { general: "Adatbázis hiba!" },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");

}

export async function deleteGasEngine(id:number) {
     const q = `DELETE FROM gas_engines WHERE id = ${id};`;
     const res = await exec_query(q);
     revalidatePath("/simulate"); 
}

export async function addNewEnergyStorage(uid: number, prevState: EnergyStorageState, formData: FormData) {
     const validatedData = EnergyStorageSchema.safeParse({
          name: formData.get("genName"),
          storage_min: formData.get("storage_min"),
          storage_max: formData.get("storage_max"),
          charge_max: formData.get("charge_max"),
          discharge_max: formData.get("discharge_max"),
          charge_loss: formData.get("charge_loss"),
          discharge_loss: formData.get("discharge_loss"),
          charge_cost: formData.get("charge_cost"),
          discharge_cost: formData.get("discharge_cost"),
          s0: formData.get("s0"),
     });

     if (!validatedData.success) {
          console.log("Invalid data:")
          console.log(validatedData.error.flatten().fieldErrors)
          return {
               errors: validatedData.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }

     const data = validatedData.data;
     const q = `INSERT INTO energy_storage (uid, name, storage_min, storage_max, charge_max, discharge_max, charge_loss, discharge_loss, charge_cost, discharge_cost, s0) VALUES (${uid}, ${escape(data.name)}, ${data.storage_min}, ${data.storage_max}, ${data.charge_max}, ${data.discharge_max}, ${data.charge_loss}, ${data.discharge_loss}, ${data.charge_cost}, ${data.discharge_cost}, ${data.s0 === null ? 'NULL' : data.s0})`;

     const res = await exec_query(q);
     if (!res.success) {
          console.log(res.message);
          return {
               errors: { general: "Adatbázis hiba!" },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");
}

export async function modifyEnergyStorage(id: number, prevState: EnergyStorageState, formData: FormData) {
     const validatedData = EnergyStorageSchema.safeParse({
          name: formData.get("genName"),
          storage_min: formData.get("storage_min"),
          storage_max: formData.get("storage_max"),
          charge_max: formData.get("charge_max"),
          discharge_max: formData.get("discharge_max"),
          charge_loss: formData.get("charge_loss"),
          discharge_loss: formData.get("discharge_loss"),
          charge_cost: formData.get("charge_cost"),
          discharge_cost: formData.get("discharge_cost"),
          s0: formData.get("s0"),
     });

     if (!validatedData.success) {
          console.log("Invalid data:")
          console.log(validatedData.error.flatten().fieldErrors)
          return {
               errors: validatedData.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }

     const data = validatedData.data;
     const q = `UPDATE energy_storage SET name = ${escape(data.name)}, storage_min = ${data.storage_min}, storage_max = ${data.storage_max}, charge_max = ${data.charge_max}, discharge_max = ${data.discharge_max}, charge_loss = ${data.charge_loss}, discharge_loss = ${data.discharge_loss}, charge_cost = ${data.charge_cost}, discharge_cost = ${data.discharge_cost}, s0 = ${data.s0 === null ? 'NULL' : data.s0} WHERE id = ${id};`;

     const res = await exec_query(q);
     if (!res.success) {
          console.log(res.message);
          return {
               errors: { general: "Adatbázis hiba!" },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");

}

export async function deleteEnergyStorage(id:number) {
     const q = `DELETE FROM energy_storage WHERE id = ${id};`;
     const res = await exec_query(q);
     revalidatePath("/simulate"); 
}

export async function addNewSolarPanel(uid: number, prevState: SolarPanelState, formData: FormData) {
     const r0 = formData.get("r0") === "" ? null : formData.get("r0");
     const validatedData = SolarPanelSchema.safeParse({
          name: formData.get("genName"),
          r_max: formData.get("r_max"),
          delta_r_plus_max: formData.get("delta_r_plus_max"),
          delta_r_minus_max: formData.get("delta_r_minus_max"),
          cost: formData.get("cost"),
          r0: r0,
          shift_start: formData.get("shift_start"),
          exp_v: formData.get("exp_v"),
          intval_range: formData.get("intval_range"),
          value_at_end: formData.get("value_at_end"),
          addNoise: formData.get("addNoise"),
          seed: formData.get("seed"),
     });

     if (!validatedData.success) {
          console.log("Invalid data:")
          console.log(validatedData.error.flatten().fieldErrors)
          return {
               errors: validatedData.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }

     const data = validatedData.data;
     const q = `INSERT INTO solar_panel (uid, name, r_max, delta_r_plus_max, delta_r_minus_max, cost, r0, shift_start, exp_v, intval_range, value_at_end, addNoise, seed) VALUES (${uid}, ${escape(data.name)}, ${data.r_max}, ${data.delta_r_plus_max}, ${data.delta_r_minus_max}, ${data.cost}, ${data.r0 === null ? 'NULL' : data.r0}, ${data.shift_start}, ${data.exp_v}, ${data.intval_range}, ${data.value_at_end}, ${data.addNoise == "1" ? "True" : "False"}, ${data.seed});`;

     const res = await exec_query(q);
     if (!res.success) {
          console.log(res.message);
          return {
               errors: { general: "Adatbázis hiba!" },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");
}

export async function modifySolarPanel(id: number, prevState: SolarPanelState, formData: FormData) {
     const r0 = formData.get("r0") === "" ? null : formData.get("r0");
     const validatedData = SolarPanelSchema.safeParse({
          name: formData.get("genName"),
          r_max: formData.get("r_max"),
          delta_r_plus_max: formData.get("delta_r_plus_max"),
          delta_r_minus_max: formData.get("delta_r_minus_max"),
          cost: formData.get("cost"),
          r0: r0,
          shift_start: formData.get("shift_start"),
          exp_v: formData.get("exp_v"),
          intval_range: formData.get("intval_range"),
          value_at_end: formData.get("value_at_end"),
          addNoise: formData.get("addNoise"),
          seed: formData.get("seed"),
     });

     if (!validatedData.success) {
          console.log("Invalid data:")
          console.log(validatedData.error.flatten().fieldErrors)
          return {
               errors: validatedData.error.flatten().fieldErrors,
               message: 'Hiányos adatok!',
          };
     }

     const data = validatedData.data;
     const q = `UPDATE solar_panel SET name = ${escape(data.name)}, r_max = ${data.r_max}, delta_r_plus_max = ${data.delta_r_plus_max}, delta_r_minus_max = ${data.delta_r_minus_max}, cost = ${data.cost}, r0 = ${data.r0 === null ? 'NULL' : data.r0}, shift_start = ${data.shift_start}, exp_v = ${data.exp_v}, intval_range = ${data.intval_range}, value_at_end = ${data.value_at_end}, addNoise = ${data.addNoise == "1" ? "True" : "False"}, seed = ${data.seed} WHERE id = ${id};`;

     const res = await exec_query(q);
     if (!res.success) {
          console.log(res.message);
          return {
               errors: { general: "Adatbázis hiba!" },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");

}

export async function deleteSolarPanel(id:number) {
     const q = `DELETE FROM solar_panel WHERE id = ${id};`;
     const res = await exec_query(q);
     revalidatePath("/simulate"); 
}

export async function getGenerators(type: "GAS" | "SOLAR" | "STORE", uid: number) {
     let table = DbNameExchange[type];
     const q = `SELECT * FROM ${table} WHERE uid = ${uid} ORDER BY active DESC;`;
     return await exec_query(q) as DbActionResult<[SolarPanel | GasEngine | EnergyStorage]>;
}

export async function getGeneratorById(type: "GAS" | "SOLAR" | "STORE", id: number, uid:number) {
     let table = DbNameExchange[type];
     const q = `SELECT * FROM ${table} WHERE id = ${id} AND (uid = ${uid} OR ${uid} IN (SELECT id FROM user WHERE role = 'admin'));`;
     const res = await exec_query(q) as DbActionResult<[SolarPanel | GasEngine | EnergyStorage]>;
     if (res.success && res.result!.length === 0)
          return {success: false, message: "Nincs ilyen generátor az adatbázisban!", result: null} as DbActionResult<null>;
     return res;
}


export async function changeGeneratorActivity(id: number, val: boolean, type: "GAS" | "SOLAR" | "STORE") {
     let table = DbNameExchange[type];

     const q = `UPDATE ${table} SET active = ${val ? "True" : "False"} WHERE id = ${id};`;

     const res = await exec_query(q);
     revalidatePath("/simulate");
}