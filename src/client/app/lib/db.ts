'use server';
import mysql from 'mysql2/promise';


/**
 * The function connects to the database and execute the given query then returns the result.
 * @param query The executable query.
 * @returns Return the following type {success: boolean, message?: string, result: T[]|null}. If an error occured success value is false message is defined and containes the error message and the result is null. Otherwise success is true message is undefined and the result containes the query result. 
 */
export async function exec_query(query: string) {
     try {
          const db_access = {
               host: process.env.DB_HOST,
               database: process.env.DB_NAME,
               user: process.env.DB_USER,
               password: process.env.DB_PASS
          };
          const db = await mysql.createConnection(db_access);
          let result: any = null
          if (query.startsWith("SELECT"))
               [result] = await db.execute(query);
          else
               await db.execute(query);
          await db.end();
          return { success: true, result: result };
     } catch (error) {
          console.log(error);
          return { success: false, message: `Adatbázis hiba.`, result: null };
     }
}