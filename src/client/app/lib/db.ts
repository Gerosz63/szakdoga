'use server';

import mysql from 'mysql2/promise';
import { User } from './definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {hash} from 'bcrypt';

export type State = {
          errors?: {
               username?: string[];
               password?: string[];
               password_rep?: string[];
               role?: string[];
               theme?: string[];
          };
          message?: string | null;
     };

const FormSchema = z.object({
     username: z.string(),
     password: z.string(),
     password_rep: z.string(),
     role: z.enum(["admin", "user"]),
}).superRefine(async (data, ctx) => {
     if (data.password !== data.password_rep) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message:"A jelszavak nem egyeznek!",
               path:["password_rep"]
          });
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: " ",
               path:["password"]
          });
     }
     const user = await isUserExists(data.username);
     if (user) {
          ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "A felhasználónév már foglalat",
               path: ["username"]
          });
     }
});
 


async function connectDb() {
     const db_access = {
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASS
     };
     return await mysql.createConnection(db_access);
}

export async function addUser(prevState: State, formData: FormData) {
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
     try {
          const data = dataValidated.data;
          const db = await connectDb();
          const qstr = `INSERT INTO user (name, password, role) VALUES ('${data.username}', '${await hash(data.password,10)}', '${data.role}');`;
          console.log(qstr);
          await db.execute(qstr);
          await db.end();
     }
     catch (error)
     {
          return {
               message: "Adatbázis hiba! A felhasználó hozzáadása sikertelen!"
          };
     }
     revalidatePath('/home/usermanager');
     redirect('/home/usermanager');
}
export async function modifyUser(userData:User) {
     try {
          const db = await connectDb();
          const [result] = await db.execute(`UPDATE user name = '${userData.username}', password = '${userData.password}', role = '${userData.role}', theme = '${userData.theme}';`);
          await db.end();
          return result;
     }
     catch (error)
     {
          console.error(error);
          return error;
     }
}

export async function removeUser(id:number) {
     try {
          const db = await connectDb();
          const [result] = await db.execute(`DELETE FROM user WHERE id = ${id};`);
          await db.end();
          return result;
     }
     catch (error)
     {
          console.error(error);
          return {message: "Adatbázis hiba."};
     }
}

export async function listUsers(search:string = "") {
     try {
          const db = await connectDb();
          const [result] = await db.execute(`SELECT id, name, role, theme FROM user${search && " WHERE name LIKE '%" + search + "%'"};`);
          await db.end;
          console.log(result)
          return result;
     }
     catch (error)
     {
          console.error(error);
          return {message: "Adatbázis hiba."};
     }
}
export async function isUserExists(userName:string) {
     try {
          const db = await connectDb();
          const [result]: Array<Array<object>> = await db.execute(`SELECT id FROM user WHERE name = '${userName}'`);
          await db.end();
          return result?.length == 0;
     }catch (error) {
          console.log(error);
          return {message: "Adatbázis hiba."};
     }
}

