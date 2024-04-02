"use client";
import { EnergyStorage, GasEngine, GasEngineNameExchange, SolarPanel } from "@/app/lib/definitions";
import clsx from "clsx";
import { changeGeneratorActivity, deleteGasEngine } from "@/app/lib/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faPen, faToggleOff, faToggleOn, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";


export default function Element({ generator, type, callback }: { generator: EnergyStorage | GasEngine | SolarPanel, type: "GAS" | "SOLAR" | "STORE", callback: Dispatch<SetStateAction<{ id: number, name: string }>> }) {
     const elementId = type + String(generator.id);
     const [state, setState] = useState(true);
     const getValue = (k: keyof (typeof generator)) => {
          return generator[k];
     };
     return (
          <>
               <div className={clsx("row align-items-center g-1 border rounded-4 py-2 px-1 cursor-pointer mb-3", { "opacity-50": !generator.active })}>
                    <div className="col fs-4 ps-3">
                         {generator.name}
                    </div>
                    <div className="col-auto">
                         <div className="input-group">
                              <button onClick={(e) => setState(!state)} className={clsx("btn", { "btn-info": !state }, { "btn-outline-info": state })} title="Részletek" data-bs-toggle="collapse" data-bs-target={"#" + elementId} aria-expanded="false" aria-controls={elementId}><FontAwesomeIcon icon={state ? faChevronDown : faChevronUp} /></button>
                              <Link href={`/simulate/modify/${generator.id}/gasengine`} className="btn btn-outline-warning" type="button"><FontAwesomeIcon icon={faPen} /></Link>
                              <button onClick={(e) => callback({ id: generator.id, name: generator.name })} data-bs-toggle="modal" data-bs-target={`#modal${type}Delete`} className="btn btn-outline-danger" type="button"><FontAwesomeIcon icon={faTrash} /></button>
                              <button onClick={(e) => changeGeneratorActivity(generator.id, !generator.active, type)} className="btn btn-outline-secondary" type="button" title="Aktív/inaktív">
                                   <FontAwesomeIcon icon={generator.active ? faToggleOn : faToggleOff} />
                              </button>
                         </div>
                    </div>
                    <div id={elementId} className="collapse">
                         <hr />
                         <ul className="list-group m-3">
                              {
                                   Object.keys(generator).filter((k) => !["id", "uid", "active", "name"].includes(k)).map((k) => {
                                        let key = k as keyof typeof generator;
                                        return (
                                             <li key={k} className="list-group-item d-flex justify-content-between align-items-center">
                                                  {GasEngineNameExchange[key]}
                                                  <span className="badge text-bg-secondary rounded-2">{generator[key] === null ? "-" : generator[key]}</span>
                                             </li>
                                        );
                                   })
                              }
                         </ul>
                    </div>
               </div>
          </>
     );
}