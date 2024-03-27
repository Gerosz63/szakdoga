"use client";
import Link from "next/link";
import { DbActionResult, User } from "@/app/lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSun, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { removeUser } from "@/app/lib/actions";

export default function UserTable({users}: {users:DbActionResult<[User]> | DbActionResult<null>}) {
     const [state, setState] = useState({username:"", id:-1});

     return (
          <>
               <table className="table table-striped">
                    <thead>
                         <tr>
                              <th>Felhasználónév</th>
                              <th>Szerepkör</th>
                              <th>Téma</th>
                              <th></th>
                         </tr>
                    </thead>
                    <tbody>
                         {
                              users?.success ? users.result!.map((e) => 
                                   <tr key={e.id}>
                                        <td>{e.username}</td>
                                        <td>{e.role}</td>
                                        <td className="fs-4">{e.theme == "light" ? <FontAwesomeIcon className="text-warning" icon={faSun} /> : <FontAwesomeIcon className="text-dark" icon={faMoon} />}</td>
                                        <td>
                                             <Link href={`/usermanager/${e.id}/modify`} className="btn btn-warning" type="button"><FontAwesomeIcon icon={faPen} /></Link>
                                             <button data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={(a) => setState({username: e.username, id: e.id!})} className="btn btn-danger" type="button"><FontAwesomeIcon icon={faTrash} /></button>
                                        </td>
                                   </tr>
                              
                              ) : <tr><td className="text-center" colSpan={4}>Nincs találat!</td></tr>
                              
                         }
                    </tbody>
               </table>
               <div id="deleteModal" className="modal" tabIndex={-1}>
                    <div className="modal-dialog">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h5 className="modal-title">Biztosan törlöd a(z) {state.username} nevű felhasználót?</h5>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Mégsem</button>
                                   <button onClick={(e) => removeUser(state.id)} data-bs-dismiss="modal" type="button" className="btn btn-danger">Törlés</button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}