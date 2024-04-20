"use client";
import Link from "next/link";
import { DbActionResult, User } from "@/app/lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSun, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { removeUser } from "@/app/lib/actions";

export default function Table({ users, uid }: { users: DbActionResult<User[]> | DbActionResult<null>, uid:number }) {
     const [state, setState] = useState({ username: "", id: -1 });
     return (
          <>
               <div className="container-fluid mb-4">
                    <div className="row">
                         <div className="col-5 fw-bold">
                              Felhasználónév
                         </div>
                         <div className="col-3 fw-bold">
                              Szerepkör
                         </div>
                         <div className="col-1 fw-bold text-center">
                              Téma
                         </div>
                    </div>
                    {
                         users?.success &&
                         users!.result?.map(e => {
                              return (
                                   <div key={e.id} className="row border rounded-4 shadow my-3 px-2 py-2 align-items-center bg-light">
                                        <div className="col-5">
                                             {e.username}
                                        </div>
                                        <div className="col-3">
                                             {e.role}
                                        </div>
                                        <div className="col-1 fs-4 text-center justify-content-center">
                                             {<FontAwesomeIcon className="text-warning" icon={e.theme == "light" ? faSun : faMoon} />}
                                        </div>
                                        <div className="col-3">
                                             <div className="input-group justify-content-end">
                                                  <Link href={`/usermanager/${e.id}/modify`} className="btn btn-warning" type="button"><FontAwesomeIcon icon={faPen} /></Link>
                                                  {
                                                       e.id != uid &&
                                                       <button data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={(a) => setState({ username: e.username, id: e.id! })} className="btn btn-danger" type="button"><FontAwesomeIcon icon={faTrash} /></button>
                                                  }
                                             </div>
                                        </div>
                                   </div>
                              );
                         })
                    }
                    {
                         (users.success && users.result!.length == 0) &&
                         <div className="row border rounded-4 shadow my-2 px-2 py-2 align-items-center">
                              <div className="col text-center">
                                   Nincs találat...
                              </div>
                         </div>
                    }
                    {
                         !users.success &&
                         <div className="bottom-0 start-0 position-fixed w-100 px-2" tabIndex={-2}>
                              <div role="alert" className="alert alert-danger">{users.message!}</div>
                         </div>
                    }
               </div>
               <div id="deleteModal" className="modal" tabIndex={-1}>
                    <div className="modal-dialog">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h5 className="modal-title">Biztosan törlöd a(z) <b>{state.username}</b> nevű felhasználót?</h5>
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