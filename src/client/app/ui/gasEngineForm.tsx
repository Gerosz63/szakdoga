"use client";

import { addNewGasEngine, modifyGasEngine } from "@/app/lib/actions";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { GasEngine, GasEngineState } from "../lib/definitions";
import { useState } from "react";

export default function Form({ action, gasEngine }: { action: "ADD" | "MODIFY", gasEngine?: GasEngine }) {
     const initialState : GasEngineState = { message: null, errors: {} };
     const GasEngineWithId = action == "ADD" ? addNewGasEngine.bind(null, +useSession().data?.user.id!) : modifyGasEngine.bind(null, +gasEngine?.id!);
     const [state, dispatch] = useFormState(GasEngineWithId, initialState);


     const [nameState, SetName] = useState(true);
     const [gmaxState, SetGmax] = useState(true);
     const [gplusmaxState, SetGplusmax] = useState(true);
     const [gminusmaxState, SetGminusmax] = useState(true);
     const [costState, SetCost] = useState(true);
     const [g0State, SetG0] = useState(true);

     function inputChange(name: string) {
          console.log("Név: " + name);
          switch (name) {
               case "genName":
                    SetName(false);
                    break;
               case "gmax":
                    SetGmax(false);
                    break;
               case "gplusmax":
                    SetGplusmax(false);
                    break;
               case "gminusmax":
                    SetGminusmax(false);
                    break;
               case "cost":
                    SetCost(false);
                    break;
               case "g0":
                    SetG0(false);
                    break;
               case "submitBtn":
                    SetName(true);
                    SetGmax(true);
                    SetGplusmax(true);
                    SetGminusmax(true);
                    SetCost(true);
                    SetG0(true);
                    break;
               default:
                    break;
          }
     }




     return (
          <form action={dispatch} className="container-fluid">
               <div className="row mb-2">
                    <div className="col-md">
                         <label className="form-label" htmlFor="genName">Név:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.name && nameState, "is-valid": nameState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.name })} type="text" name="genName" id="genName" required maxLength={20} defaultValue={gasEngine?.name ?? ""} />
                         {
                              (state.errors?.name && nameState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.name.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md">
                         <label className="form-label" htmlFor="gmax">Maximális termelés:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.gmax && gmaxState, "is-valid": gmaxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.gmax })} type="text" name="gmax" id="gmax" required defaultValue={gasEngine?.gmax ?? ""} />
                         {
                              (state.errors?.gmax && gmaxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.gmax.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row mb-2">
                    <div className="col-md">
                         <label className="form-label" htmlFor="gplusmax">Maximális felfutási ráta:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.gplusmax && gplusmaxState, "is-valid": gplusmaxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.gplusmax })} type="text" name="gplusmax" id="gplusmax" required defaultValue={gasEngine?.gplusmax ?? ""} />
                         {
                              (state.errors?.gplusmax && gplusmaxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.gplusmax.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md">
                         <label className="form-label" htmlFor="gminusmax">Maximális lefutási ráta:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.gminusmax && gminusmaxState, "is-valid": gminusmaxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.gminusmax })} type="text" name="gminusmax" id="gminusmax" required defaultValue={gasEngine?.gminusmax ?? ""} />
                         {
                              (state.errors?.gminusmax && gminusmaxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.gminusmax.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row mb-4">
                    <div className="col-md">
                         <label className="form-label" htmlFor="cost">Költség megtermelt egységenként:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.cost && costState, "is-valid": costState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.cost })} type="text" name="cost" id="cost" required defaultValue={gasEngine?.cost ?? ""} />
                         {
                              (state.errors?.cost && costState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.cost.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md">
                         <label className="form-label" htmlFor="g0">Kezdeti termelés:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.g0 && g0State, "is-valid": g0State && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.g0 })} type="text" name="g0" id="g0" defaultValue={gasEngine?.g0 ?? ""} />
                         {
                              (state.errors?.g0 && g0State) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.g0.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row justify-content-between">
                    <div className="col-auto">
                         <Link className="btn btn-secondary" href="/simulate">Vissza</Link>
                    </div>
                    <div className="col"><hr /></div>
                    <div className="col-auto">
                         <button name="submitBtn" onClick={(e) => inputChange(e.currentTarget.name)} className={clsx("btn", { "btn-success": action == "ADD" }, { "btn-warning": action == "MODIFY" })} type="submit">{action == "ADD" ? "Hozzáadás" : "Módosítás"}</button>
                    </div>
               </div>
          </form>
     );
}