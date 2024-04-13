"use client";
import { EnergyStorage, EnergyStorageNameExchange, GasEngine, GasEngineNameExchange, SolarPanel, SolarPanelNameExchange } from "@/app/lib/definitions";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";



export default function Element({ generator, type }: { generator: EnergyStorage | GasEngine | SolarPanel, type: "GAS" | "SOLAR" | "STORE" }) {
     const elementId = type + String(generator.id);
     const [state, setState] = useState(true);
     
     const getName = (key: keyof (typeof generator)) => {
          switch (type) {
               case "GAS":
                    return GasEngineNameExchange[key];
               case "SOLAR":
                    return SolarPanelNameExchange[key];
               case "STORE":
                    return EnergyStorageNameExchange[key];
               default:
                    return <></>;
          }
     }

     return (
          <div className={clsx("row align-items-center g-1 border rounded-4 py-2 px-1 cursor-pointer mb-3", { "opacity-50": !generator.active })}>
               <div className="col fs-4 ps-3">
                    {generator.name}
               </div>
               <div className="col-lg-auto col-12">
                    <button onClick={(e) => setState(!state)} className={clsx("btn", { "btn-info": !state }, { "btn-outline-info": state })} title="Részletek" data-bs-toggle="collapse" data-bs-target={"#" + elementId} aria-expanded="false" aria-controls={elementId}><FontAwesomeIcon icon={state ? faChevronDown : faChevronUp} /></button>
               </div>
               <div id={elementId} className="collapse">
                    <hr />
                    <ul className="list-group m-3">
                         {
                              Object.keys(generator).filter((k) => !["id", "uid", "active", "name"].includes(k)).map((k) => {
                                   let key = k as keyof typeof generator;
                                   return (
                                        <li key={k} className="list-group-item d-flex justify-content-between align-items-center">
                                             {getName(key)}
                                             <span className="badge text-bg-secondary rounded-2">{generator[key] === null ? "-" : generator[key]}</span>
                                        </li>
                                   );
                              })
                         }
                    </ul>
               </div>
          </div>
     );
}