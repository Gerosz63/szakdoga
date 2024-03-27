'use server';
import mysql from 'mysql2/promise';

export async function exec_query(query:string) {
     try {
          const db_access = {
               host: process.env.DB_HOST,
               database: process.env.DB_NAME,
               user: process.env.DB_USER,
               password: process.env.DB_PASS
          };
          const db = await mysql.createConnection(db_access);
          let result:any = null
          if (query.startsWith("SELECT")) 
               [result] = await db.execute(query);
          else
               await db.execute(query);
          await db.end();
          return {success:true, result:result};
     } catch (error) {
          return {success:false, message: "Adatbázi hiba. (" + error+")", result:null};
     }
}