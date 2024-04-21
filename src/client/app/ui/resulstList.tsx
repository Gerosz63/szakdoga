"use client";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";


import { useState } from "react";
import { deleteResult } from "@/app/lib/actions";
import ErrorAlert from "@/app/ui/errorAlerts";

export default function List({ results }: { results: { id: number, name: string, saveDate: Date, exec_time: number }[] }) {
     const [state, SetState] = useState({ id: -1, name: "" });
     const [errorState, SetError] = useState({success: true, message: ""});

     async function deleteHandeler() {
          const res = await deleteResult(state.id);
          console.log(res);
          
          if (!res?.success) {
               SetError({success: false, message: res?.message!});
          }
     }

     return (
          <div className="mt-3">
               {
                    results.map((e) =>
                         <div key={e.id} className="fs-5 row justify-content-center border mt-3 rounded py-2 align-items-center shadow mybg-white">
                              <div className="col-lg-4 fw-bold">{e.name}</div>
                              <div className="col-lg-4">{e.saveDate.toISOString().replace("T", " ").replace(".000Z", "")}</div>
                              <div className="col-lg-2 text-end">{Math.ceil(e.exec_time * 1000) / 1000} ms</div>
                              <div className="col-lg-2">
                                   <div className="input-group justify-content-end">
                                        <Link className="btn btn-secondary" href={`/results/show/${e.id}`}><FontAwesomeIcon icon={faEye} /></Link>
                                        <button onClick={(a) => SetState({ id: e.id, name: e.name })} className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#resultDeleteModal"><FontAwesomeIcon icon={faTrash} /></button>
                                   </div>
                              </div>
                         </div>
                    )
               }
               <div className="modal fade" id="resultDeleteModal" tabIndex={-1} aria-labelledby="resultDeleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h1 className="modal-title fs-5" id="resultDeleteModalLabel">Biztosan törlöd a(z) <b>{state.name}</b> nevű eredményed?</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Vissza</button>
                                   <button onClick={(e) => deleteHandeler()} type="button" data-bs-dismiss="modal" className="btn btn-danger">Törlés</button>
                              </div>
                         </div>
                    </div>
               </div>
               {
                    !errorState.success &&
                    <ErrorAlert callback={SetError} text={errorState.message} /> 
               }
          </div>
     );
}