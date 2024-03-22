
import Link from "next/link";
import { listUsers } from "../lib/db";
import { DbActionResult, User } from "../lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSun, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { json } from "stream/consumers";

export default async function UserTable({query, page}: {query:string, page:number}) {
     const users:DbActionResult<[User]> = await listUsers(query, page);

     return (
          <table className="table table-striped">
               <thead>
                    <th>Felhasználónév</th>
                    <th>Szerepkör</th>
                    <th>Téma</th>
                    <th></th>
               </thead>
               <tbody>
                    {
                        users?.success ? users!.result.map((e) => 
                              <tr>
                                   <td>{e.username}</td>
                                   <td>{e.role}</td>
                                   <td className="fs-4">{e.theme == "light" ? <FontAwesomeIcon className="text-warning" icon={faSun} /> : <FontAwesomeIcon className="text-dark" icon={faMoon} />}</td>
                                   <td>
                                        <Link href={`/home/usermanager/${e.id}/modify`} className="btn btn-warning" type="button"><FontAwesomeIcon icon={faPen} /></Link>
                                        <button className="btn btn-danger" type="button"><FontAwesomeIcon icon={faTrash} /></button>
                                   </td>
                              </tr>
                         
                         ) : <tr><td className="text-center" colSpan="4">Nincs találat!</td></tr>
                         
                    }
               </tbody>
          </table>
     );
}