"use server";
import { revalidatePath } from "next/cache";
import { exec_query } from "@/app/lib/db";
import { DbActionResult, UserState, User, GasEngineState, SolarPanel, GasEngine, EnergyStorage, DbNameExchange } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { FormModifySchema, FormSchema, GasEngineSchema } from "@/app/lib/schemas";
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
     const qstr = `INSERT INTO user (username, password, role) VALUES ('${data.username}', '${await hash(data.password, 10)}', '${data.role}');`;
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
     const q = `UPDATE user SET username = '${data.username}'${data.password !== null ? ", password = '" + hash(data.password, 10) + "'" : ""}, role = '${data.role}' WHERE id = ${id};`;
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
     const q = `SELECT id FROM user WHERE ${typeof userId == "number" ? "id = " + userId : "username = '" + userId + "'"}`;
     const res = await exec_query(q);
     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba.", success: false, result: null } as DbActionResult<null>;
     }
     return { result: res.result?.length != 0, success: true } as DbActionResult<boolean>;
}


export async function listUsers(search: string = "", page: number = 1, limit: number = 10) {
     const q = `SELECT id, username, role, theme FROM user${search && " WHERE username LIKE '%" + search + "%'"} LIMIT ${(page - 1) * 10},${limit};`;
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
     const q = `SELECT id, username, password, role FROM user WHERE username = '${name}';`;
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

export async function getGenerators(type: "GAS" | "SOLAR" | "STORE", uid: number) {
     let table = DbNameExchange[type];
     const q = `SELECT * FROM ${table} WHERE uid = ${uid} ORDER BY active DESC;`;
     return await exec_query(q) as DbActionResult<[SolarPanel | GasEngine | EnergyStorage]>;
}

export async function getGeneratorById(type: "GAS" | "SOLAR" | "STORE", id: number) {
     let table = DbNameExchange[type];
     const q = `SELECT * FROM ${table} WHERE id = ${id};`;
     return await exec_query(q) as DbActionResult<[SolarPanel | GasEngine | EnergyStorage]>;
}


export async function changeGeneratorActivity(id: number, val: boolean, type: "GAS" | "SOLAR" | "STORE") {
     let table = DbNameExchange[type];

     const q = `UPDATE ${table} SET active = ${val ? "True" : "False"} WHERE id = ${id};`;

     const res = await exec_query(q);
     revalidatePath("/simulate");
}