"use client";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";


import { useState } from "react";
import { deleteResult } from "@/app/lib/actions";

export default function List({ results }: { results: { id: number, name: string }[] }) {
     const [state, SetState] = useState({ id: -1, name: "" });

     return (
          <>
               {
                    results.map((e) =>
                         <div className="row">
                              <div className="col">{e.name}</div>
                              <div className="col-auto input-group">
                                   <Link className="btn btn-warning" href={`/results/show/${e.id}`}><FontAwesomeIcon icon={faPen} /></Link>
                                   <button onClick={(a) => SetState({id: e.id, name: e.name})} className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#resultDeleteModal"><FontAwesomeIcon icon={faTrash} /></button>
                              </div>
                         </div>
                    )
               }
               <div className="modal fade" id="resultDeleteModal" tabIndex={-1} aria-labelledby="resultDeleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h1 className="modal-title fs-5" id="resultDeleteModalLabel">Biztosan törlöd a(z) {state.name} nevű eredményed?</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Vissza</button>
                                   <button onClick={(e) => deleteResult(state.id)} type="button" className="btn btn-danger">Törlés</button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}