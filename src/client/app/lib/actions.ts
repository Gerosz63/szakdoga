"use server";
import { revalidatePath } from "next/cache";
import { exec_query } from "@/app/lib/db";
import { DbActionResult, UserState, User, GasEngineState, SolarPanel, GasEngine, EnergyStorage, DbNameExchange, EnergyStorageState, SolarPanelState, Results, SolverData, Charts } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { FormModifySchema, FormSchema, GasEngineSchema, EnergyStorageSchema, SolarPanelSchema } from "@/app/lib/schemas";
import { escape } from "mysql2";
import { unstable_noStore as noStore } from 'next/cache';
import { z } from "zod";
import { cookies } from "next/headers";


/**
 * Action to add new user to databasethen then revalidating usermanager path and redirect to it.
 * @param prevState
 * @param formData
 * @returns 
 */
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

/**
 * Action to modify existing user in database then revalidating usermanager path and redirect to it.
 * @param id
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function modifyUser(uid: number, prevState: UserState, formData: FormData) {
     const dataValidated = await FormModifySchema.safeParseAsync({
          id: uid,
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
     const q = `UPDATE user SET username = ${escape(data.username)}${data.password !== null ? ", password = '" + hash(data.password, 10) + "'" : ""}${data.role !== null ? ", role =" + escape(data.role) : ""} WHERE id = ${uid};`;
     const res = await exec_query(q);
     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba! A felhasználó módosítása sikertelen!" };
     }
     revalidatePath('/');
     redirect('/usermanager');
}

/**
 * Action to remove existing user then revalidating usermanager path.
 * @param id 
 * @returns 
 */
export async function removeUser(id: number) {
     const q = `DELETE FROM user WHERE id = ${id};`;
     const res = await exec_query(q);
     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba. A felhasználó nem törölhető!" };
     }

     revalidatePath('/usermanager');
}


/**
 * Determine if a user is exsist by its name or id.
 * @param userId 
 * @returns 
 */
export async function isUserExists(userId: string | number) {
     const q = `SELECT id FROM user WHERE ${typeof userId == "number" ? "id = " + userId : "username = " + escape(userId)}`;
     const res = await exec_query(q);
     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba.", success: false, result: null } as DbActionResult<null>;
     }
     return { result: res.result?.length != 0, success: true } as DbActionResult<boolean>;
}

/**
 * Returns list of users by the search value and the selected page number.
 * @param search 
 * @param page 
 * @param limit 
 * @returns 
 */
export async function listUsers(search: string = "", page: number = 1, limit: number = 10) {
     noStore();
     const q = `SELECT id, username, role, theme FROM user${search && " WHERE username LIKE '%" + escape(search).substring(1, escape(search).length - 1) + "%'"} LIMIT ${(page - 1) * 10},${limit};`;
     const res = await exec_query(q);

     if (!res.success) {
          console.log(res?.message);
          return { message: "Adatbázis hiba.", success: false, result: null } as DbActionResult<null>;
     }
     return { success: true, result: res.result as Array<User> } as DbActionResult<User[]>;
}

/**
 * Returns a user by its id.
 * @param id 
 * @returns 
 */
export async function getUserById(id: number) {
     noStore();
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

/**
 * Returns a user by its name.
 * @param name 
 * @returns 
 */
export async function getUserByName(name: string) {
     noStore();
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

/**
 * Login to the page and delets the additional cookies.
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function login(prevState: string | undefined, formData: FormData) {
     try {
          await signIn("credentials", formData);
          const mycookie = cookies();
          mycookie.delete("demand");
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

/**
 * Logs out from page and deletes the cookies.
 */
export async function logout() {
     const mycookie = cookies();
     mycookie.delete("demand");
     await signOut();
}

/**
 * Save demand value into cookie.
 * @param data 
 */
export async function SetDemandInCookie(data: string) {
     const mycookie = cookies();
     mycookie.set("demand", data);
}

/**
 * Adds new gas engine. Validates data and if correct adds new engine to database then revalidates page and redirects to page simulate.
 * @param uid 
 * @param prevState 
 * @param formData 
 * @returns 
 */
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
               errors: { general: ["Adatbázis hiba!"] },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");
}

/**
 * Modify gas engine by id. Validates data and if it's correct modify the engine in database, then revalidates page and redirects to page simulate.
 * @param id 
 * @param prevState 
 * @param formData 
 * @returns 
 */
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
               errors: { general: ["Adatbázis hiba!"] },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");

}

/**
 * Deletes gase engine by id.
 * @param id 
 */
export async function deleteGasEngine(id: number) {
     const q = `DELETE FROM gas_engines WHERE id = ${id};`;
     const res = await exec_query(q);
     if (res.success)
          revalidatePath("/simulate");
     else
          return res;
}

/**
 * Adds new energy storage. Validates data and if correct adds new storage to database then revalidates page and redirects to page simulate.
 * @param uid 
 * @param prevState 
 * @param formData 
 * @returns 
 */
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
               errors: { general: ["Adatbázis hiba!"] },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");
}

/**
 * Modify energy storage by id. Validates data and if it's correct then modify engine in database, then revalidates page and redirects to page simulate.
 * @param id 
 * @param prevState 
 * @param formData 
 * @returns 
 */
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
               errors: { general: ["Adatbázis hiba!"] },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");

}

/**
 * Deletes energy storage by id.
 * @param id 
 */
export async function deleteEnergyStorage(id: number) {
     const q = `DELETE FROM energy_storage WHERE id = ${id};`;
     const res = await exec_query(q);
     if (res.success)
          revalidatePath("/simulate");
     else
          return res;
}


/**
 * Adds new solar panel. First validates form data then if it's correct inserts to db and revalidate page then redirect to page simulate.
 * @param uid 
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function addNewSolarPanel(uid: number, prevState: SolarPanelState, formData: FormData) {
     const r0 = formData.get("r0") === "" ? null : formData.get("r0");
     const seed = formData.get("seed") === "" ? null : formData.get("seed");
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
          seed: seed,
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
               errors: { general: ["Adatbázis hiba!"] },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");
}
/**
 * Modify solar panel by id. First validates form data then if it's correct updates solar panel in db and revalidate page then redirect to page simulate.
 * @param id 
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function modifySolarPanel(id: number, prevState: SolarPanelState, formData: FormData) {
     const r0 = formData.get("r0") === "" ? null : formData.get("r0");
     const seed = formData.get("seed") === "" ? null : formData.get("seed");
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
          seed: seed,
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
               errors: { general: ["Adatbázis hiba!"] },
               message: "Adatbázis hiba!"
          };
     }

     revalidatePath("/simulate");
     redirect("/simulate");

}

/**
 * Deletes solar panel by id.
 * @param id 
 */
export async function deleteSolarPanel(id: number) {
     const q = `DELETE FROM solar_panel WHERE id = ${id};`;
     const res = await exec_query(q);
     if (res.success)
          revalidatePath("/simulate");
     else
          return res;
}

/**
 * Gets all generator by uid and their type. 
 * @param type 
 * @param uid 
 * @returns 
 */
export async function getGenerators(type: "GAS" | "SOLAR" | "STORE", uid: number) {
     noStore();
     let table = DbNameExchange[type];
     const q = `SELECT * FROM ${table} WHERE uid = ${uid} ORDER BY active DESC;`;
     return await exec_query(q) as DbActionResult<(SolarPanel | GasEngine | EnergyStorage)[] | null>;
}

/**
 * Gets generator by its type and id. User id given for restrict data access.
 * @param type 
 * @param id 
 * @param uid 
 * @returns 
 */
export async function getGeneratorById(type: "GAS" | "SOLAR" | "STORE", id: number, uid: number) {
     noStore();
     let table = DbNameExchange[type];
     const q = `SELECT * FROM ${table} WHERE id = ${id} AND (uid = ${uid} OR ${uid} IN (SELECT id FROM user WHERE role = 'admin'));`;
     const res = await exec_query(q) as DbActionResult<(SolarPanel | GasEngine | EnergyStorage)[]>;
     if (res.success && res.result!.length === 0)
          return { success: false, message: "Nincs ilyen generátor az adatbázisban!", result: null } as DbActionResult<null>;
     return res;
}

/**
 * Changes generator active filed value by id and type.
 * @param id 
 * @param val 
 * @param type 
 */
export async function changeGeneratorActivity(id: number, val: boolean, type: "GAS" | "SOLAR" | "STORE") {
     let table = DbNameExchange[type];

     const q = `UPDATE ${table} SET active = ${val ? "True" : "False"} WHERE id = ${id};`;

     const res = await exec_query(q);
     if (res.success)
          revalidatePath("/simulate");
     else
          return res;
}

/**
 * Execute simulation by collecting the active generators then calling the solver API and if the problem is feasable redirect to page results/show/new.
 * @param uid 
 * @param demand 
 * @returns 
 */
export async function simulate(uid: number, demand: number[]) {
     const db_names = ["gas_engines", "solar_panel", "energy_storage"];
     const data: SolverData = { demand: demand, generators: { GAS: [], SOLAR: [], STORAGE: [] }, result: [] };

     // Collect all active generator.
     const [GAS, SOLAR, STORAGE] = await Promise.all(db_names.map(e => {
          const q = `SELECT * FROM ${e} WHERE uid = ${uid} and active IS TRUE;`;
          return exec_query(q);
     }));

     if (!GAS.success || !SOLAR.success || !STORAGE.success) {
          return { error: "Adatbázi hiba!" };
     }
     if (GAS.result.length == 0 &&
          SOLAR.result.length == 0 &&
          STORAGE.result.length == 0) {
          return { error: "Nincs aktív generátor! A szimuláció nem hajtható végre!" };
     }

     data.generators.GAS = GAS.result;
     data.generators.SOLAR = SOLAR.result;
     data.generators.STORAGE = STORAGE.result;


     const res = await fetch(new URL(process.env.SOLVER_URL + "?data=" + JSON.stringify(data)))
     if (!res.ok) {
          console.log("A szimulátor nem válaszól!");
          return { error: "A szimulátor nem válaszól!" };
     }

     const result = await res.json() as { success: boolean, result: number[], exec_time: number };

     if (result.success) {
          // Delete unsaved results.
          let q = `DELETE FROM results WHERE saved IS FALSE;`;
          await exec_query(q);

          // Creates a result line in the db which can be loaded later and saved later. 
          data.result = result.result;
          q = `INSERT INTO results (uid, data, exec_time, saveDate) VALUES (${uid}, ${escape(JSON.stringify(data))}, ${result.exec_time}, NOW());`;
          const res = await exec_query(q);
          if (!res.success) {
               console.log("Adatbázis hiba!");
               return { error: "Adatbázi hiba!" };
          }
          redirect("/results/show/new");
     }
     return { error: "A feladat nem optimalizálható!" };
}

/**
 * Save result by sets its saved field to TRUE and name field to the given value.
 * @param id 
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function saveResults(id: number, prevState: { message: string | null, error: string[] | null }, formData: FormData) {

     const validatedName = z.string().max(50, "A név hossza maximum 50 karakter lehet!").nullable().safeParse(formData.get("resName"));

     if (!validatedName.success) {
          console.log(validatedName.error.flatten().formErrors);
          return { message: "Hiba!", error: validatedName.error.flatten().formErrors };
     }

     const q = `UPDATE results SET saved = TRUE, name = ${escape(validatedName.data)} WHERE id = ${id} AND saved IS FALSE;`;
     const res = await exec_query(q);
     if (!res.success) {
          return { message: "Hiba!", error: ["Adatbázis hiba!"] };
     }
     revalidatePath("/results");
     redirect(`/results/show/${id}`);
}

/**
 * Deletes saved result by id.
 * @param id 
 * @returns 
 */
export async function deleteResult(id: number) {
     const q = `DELETE FROM results WHERE id = ${id};`;
     const res = await exec_query(q);
     if (!res.success)
          return { success: false, message: "Adatbázis hiba!" };
     revalidatePath("/results");
}

/**
 * Get user results by user id.
 * @param uid 
 * @returns 
 */
export async function getResults(uid: number) {
     noStore();
     const q = `SELECT id, name, saveDate, exec_time FROM results WHERE uid = ${uid} AND saved IS TRUE;`;
     const res = await exec_query(q);
     if (!res.success) {
          return { success: false, result: null, message: "Adatbázis hiba!" } as DbActionResult<null>;
     }
     else
          return res as DbActionResult<{ id: number, name: string, saveDate: Date, exec_time: number }[]>;
}

/**
 * Creates data for charts. 
 * @param data 
 * @returns 
 */
async function createChartData(data: Results) {
     const charts_data: Charts = {
          id: data.id,
          name: data.name,
          exec_time: data.exec_time,
          saveDate: data.saveDate,
          demand: [],
          generators: {
               GAS: [],
               SOLAR: [],
               STORAGE: [],
          },
          elementTypes: {
               GAS: false,
               SOLAR: false,
               STORAGE: false,
          },
          labels: [],
          elements: {
               GAS: [],
               SOLAR: [],
               STORAGE: []
          },
          sumByType: {
               GAS: { name: "Gázmotorok", data: [] },
               SOLAR: { name: "Napelemek", data: [] },
               STORAGE: {
                    store: { name: "Töltöttségi szint", data: [] },
                    charge: { name: "Elraktározott energia", data: [] },
                    discharge: { name: "Kisütött energia", data: [] },
                    produce: { name: "Energia tárolók", data: [] },
               }
          }
     }

     const input = JSON.parse(data.data) as SolverData;
     charts_data.demand = input.demand;

     charts_data.generators = input.generators;

     charts_data.elementTypes.GAS = input.generators.GAS.length != 0;
     charts_data.elementTypes.SOLAR = input.generators.SOLAR.length != 0;
     charts_data.elementTypes.STORAGE = input.generators.STORAGE.length != 0;

     const T = input.demand.length;
     charts_data.labels = Array.from(Array(T + 1).keys());
     let start = 0;
     Object.keys(input.generators).forEach((key) => {
          input.generators[key as "GAS" | "SOLAR" | "STORAGE"].forEach((e) => {
               if (key == "STORAGE") {
                    charts_data.elements.STORAGE.push({
                         name: e.name,
                         data: {
                              store: input.result.slice(start, start + T),
                              charge: input.result.slice(start + T, start + 2 * T),
                              discharge: input.result.slice(start + 2 * T, start + 3 * T)
                         }
                    });
               }
               else {
                    charts_data.elements[key as "GAS" | "SOLAR"].push({ name: e.name, data: input.result.slice(start, start + T) });
               }
               start += (key == "STORAGE" ? 3 * T : T);
          });
     });

     if (charts_data.elementTypes.GAS)
          charts_data.sumByType.GAS.data = await sumArrayElementsByIndex(charts_data.elements.GAS.map((b) => b.data));

     if (charts_data.elementTypes.SOLAR)
          charts_data.sumByType.SOLAR.data = await sumArrayElementsByIndex(charts_data.elements.SOLAR.map((b) => b.data));

     if (charts_data.elementTypes.STORAGE) {
          charts_data.sumByType.STORAGE.store.data = await sumArrayElementsByIndex(charts_data.elements.STORAGE.map((b) => b.data.store));
          charts_data.sumByType.STORAGE.charge.data = await sumArrayElementsByIndex(charts_data.elements.STORAGE.map((b) => b.data.charge));
          charts_data.sumByType.STORAGE.discharge.data = await sumArrayElementsByIndex(charts_data.elements.STORAGE.map((b) => b.data.discharge));

          for (let index = 0; index < charts_data.sumByType.STORAGE.charge.data.length; index++)
               charts_data.sumByType.STORAGE.produce.data.push(charts_data.sumByType.STORAGE.discharge.data[index] - charts_data.sumByType.STORAGE.charge.data[index]);
     }

     return charts_data;
}

/**
 * Helper function. Add arrays elements by index.
 * @param arrays The arrays length must be the same.
 * @returns 
 */
export async function sumArrayElementsByIndex(arrays: number[][]) {
     let res = arrays[0];
     if (arrays.length == 1)
          return res;

     arrays.slice(1).forEach((e) => {

          e.forEach((a, i) => {
               res[i] += a;
          })
     });

     return res;
}

/**
 * Gets result by id.
 * @param id 
 * @param uid 
 * @param role 
 * @returns 
 */
export async function getResultById(id: number, uid: number, role: string) {
     const q = `SELECT * FROM results WHERE id = ${id}${role == "admin" ? "" : ` AND uid = ${uid}`};`;
     const res = await exec_query(q);
     if (res.success && res.result.length == 0)
          return { success: false, result: null, message: "Nincs eredmény!" } as DbActionResult<null>;
     else if (!res.success)
          return { success: false, result: null, message: "Adatbázis hiba!" } as DbActionResult<null>;

     res.result = await createChartData(res.result[0]);
     return res as DbActionResult<Charts>;
}

/**
 * Get the newest result.
 * @param uid 
 * @returns 
 */
export async function getNewResult(uid: number) {
     const q = `SELECT * FROM results WHERE saved IS FALSE AND uid = ${uid} ORDER BY id DESC LIMIT 1;`;
     const res = await exec_query(q);
     if (res.success && res.result.length == 0)
          return { success: false, result: null, message: "Nincs eredmény!" } as DbActionResult<null>;
     else if (!res.success)
          return { success: false, result: null, message: "Adatbázis hiba!" } as DbActionResult<null>;

     res.result = await createChartData(res.result[0]);
     return res as DbActionResult<Charts>;
}