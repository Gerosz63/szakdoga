"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Element from "@/app/ui/generatorElement";
import Link from "next/link";
import { DbActionResult, EnergyStorage, GasEngine, SolarPanel } from "@/app/lib/definitions";
import { useState } from "react";
import { deleteEnergyStorage, deleteGasEngine, deleteSolarPanel } from "@/app/lib/actions";
import ErrorAlert from "@/app/ui/errorAlerts";

export default function List({ title, type, elements }: { title: string, type: "GAS" | "SOLAR" | "STORE", elements: DbActionResult<(SolarPanel | GasEngine | EnergyStorage)[]> }) {
     const [state, setState] = useState({ id: -1, name: "" });
     const [errorState, SetError] = useState({ success: true, message: "" });

     async function deleteGenerator() {
          let res:DbActionResult<null>|DbActionResult<any> = {success:false, result:null, message:"Hiba! Ismeretlen generátor típus!"};
          switch (type) {
               case "GAS":
                    res = await deleteGasEngine(state.id);
                    break;
               case "SOLAR":
                    res = await deleteSolarPanel(state.id);
                    break;
               case "STORE":
                    res = await deleteEnergyStorage(state.id);
                    break;
               default:
                    break;
          }
          if (!res?.success) {
               SetError({ success: false, message: res?.message! });
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
               <div className="rounded-4 border px-2 py-3 mb-2 bg-light">
                    <div className="d-flex justify-content-between ps-3">
                         <h3>{title}</h3>
                         <div>
                              <Link href={`/simulate/add/${page()}`} className="btn btn-success">
                                   <FontAwesomeIcon icon={faPlus} />
                              </Link>
                         </div>
                    </div>
                    <hr />
                    <div className="container-fluid">
                         {
                              elements.success && elements.result!.length as number !== 0 ?
                                   elements.result!.map((e) =>
                                        <Element key={e.id} generator={e} type={type} callback={setState} />
                                   ) :
                                   <div className="text-center">Nincs még ilyen résztvevőd!</div>
                         }
                    </div>
               </div>
               <div className="modal fade" id={`modal${type}Delete`} tabIndex={-1} aria-labelledby={`modal${type}DeleteLabel`} aria-hidden="true">
                    <div className="modal-dialog">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h1 className="modal-title fs-5" id={`modal${type}DeleteLabel`}>Biztosan törlöd a(z) <b>{state.name}</b> nevű {typeText()}</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                   <button onClick={(e) => deleteGenerator()} data-bs-dismiss="modal" type="button" className="btn btn-danger">Törlés</button>
                              </div>
                         </div>
                    </div>
               </div>
               {
                    !errorState.success &&
                    <ErrorAlert callback={SetError} text={errorState.message} />
               }
          </>
     );
}