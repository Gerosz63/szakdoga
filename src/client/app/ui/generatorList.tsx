"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Element from "./generatorElement";
import Link from "next/link";
import { DbActionResult, EnergyStorage, GasEngine, SolarPanel } from "../lib/definitions";
import { useState } from "react";
import { deleteEnergyStorage, deleteGasEngine, deleteSolarPanel } from "../lib/actions";

export default function List({ title, type, elements }: { title: string, type: "GAS" | "SOLAR" | "STORE", elements: DbActionResult<[SolarPanel | GasEngine | EnergyStorage]> }) {
     const [state, setState] = useState({ id: -1, name: "" });

     function deleteGenerator() {
          switch (type) {
               case "GAS":
                    deleteGasEngine(state.id);
                    break;
               case "SOLAR":
                    deleteSolarPanel(state.id);
                    break;
               case "STORE":
                    deleteEnergyStorage(state.id);
                    break;
               default:
                    break;
          }
     }

     const page = () => {
          switch (type) {
               case "GAS":
                    return "gasengine";
               case "SOLAR":
                    return "solarpanel";
               case "STORE":
                    return "energystorage";
               default:
                    return "gasengine";
          }
     };
     const typeText = () => {
          switch (type) {
               case "GAS":
                    return "gázmotort";
               case "SOLAR":
                    return "napelemet";
               case "STORE":
                    return "energia tárolót";
               default:
                    return "gázmotort";
          }
     }; 

     return (
          <>
               <div className="border rounded-4 shadow px-2 py-3 mb-2">
                    <div className="d-flex justify-content-between">
                         <h3>{title}</h3>
                         <div>
                              <Link href={`/simulate/add/${page()}`} className="btn btn-outline-success">
                                   <FontAwesomeIcon icon={faPlus} />
                              </Link>
                         </div>
                    </div>
                    <hr />
                    <div className="container-fluid">
                         {
                              elements.success && elements.result!.length as number !== 0 ?
                                   elements.result!.map((e) =>
                                        <Element key={e.id} generator={e} type={type} callback={setState}/>
                                   ) :
                                   <div className="text-center">Nincs még ilyen résztvevőd!</div>
                         }
                    </div>
               </div>
               <div className="modal fade" id={`modal${type}Delete`} tabIndex={-1} aria-labelledby={`modal${type}DeleteLabel`} aria-hidden="true">
                    <div className="modal-dialog">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h1 className="modal-title fs-5" id={`modal${type}DeleteLabel`}>Biztosan törlöd a(z) {state.name} nevű {typeText()}</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                   <button onClick={(e) => deleteGenerator()} data-bs-dismiss="modal" type="button" className="btn btn-danger">Törlés</button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}