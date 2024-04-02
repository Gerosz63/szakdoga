"use client";

import { useFormState } from "react-dom";
import { EnergyStorage, EnergyStorageState } from "@/app/lib/definitions";
import { useSession } from "next-auth/react";
import { addNewEnergyStorage, modifyEnergyStorage } from "@/app/lib/actions";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";


export default function From({ action, energyStorage }: { action: "ADD" | "MODIFY", energyStorage?: EnergyStorage }) {
     const initialState: EnergyStorageState = { message: null, errors: {} };
     const EnergyStorageWithId = action == "ADD" ? addNewEnergyStorage.bind(null, +useSession().data?.user.id!) : modifyEnergyStorage.bind(null, +energyStorage?.id!);
     const [state, dispatch] = useFormState(EnergyStorageWithId, initialState);

     const [nameState, SetName] = useState(true);
     const [storage_minState, SetStorage_min] = useState(true);
     const [storage_maxState, SetStorage_max] = useState(true);
     const [charge_maxState, SetCharge_max] = useState(true);
     const [discharge_maxState, SetDischarge_max] = useState(true);
     const [charge_lossState, SetCharge_loss] = useState(true);
     const [discharge_lossState, SetDischarge_loss] = useState(true);
     const [charge_costState, SetCharge_cost] = useState(true);
     const [discharge_costState, SetDischarge_cost] = useState(true);
     const [s0State, SetS0] = useState(true);

     function inputChange(name: string) {
          console.log("Név: " + name);
          switch (name) {
               case "genName":
                    SetName(false);
                    break;
               case "storage_min":
                    SetStorage_min(false);
                    break;
               case "storage_max":
                    SetStorage_max(false);
                    break;
               case "charge_max":
                    SetCharge_max(false);
                    break;
               case "discharge_max":
                    SetDischarge_max(false);
                    break;
               case "charge_loss":
                    SetCharge_loss(false);
                    break;
               case "discharge_loss":
                    SetDischarge_loss(false);
                    break;
               case "charge_cost":
                    SetCharge_cost(false);
                    break;
               case "discharge_cost":
                    SetDischarge_cost(false);
                    break;
               case "s0":
                    SetS0(false);
                    break;
               case "submitBtn":
                    SetName(true);
                    SetStorage_min(true);
                    SetStorage_max(true);
                    SetCharge_max(true);
                    SetDischarge_max(true);
                    SetCharge_loss(true);
                    SetDischarge_loss(true);
                    SetCharge_cost(true);
                    SetDischarge_cost(true);
                    SetS0(true);
                    break;
               default:
                    break;
          }
     }

     return (
          <form action={dispatch} className="container-fluid">
               <div className="row">
                    <div className="col-md-4 col-lg-6 mt-2">
                         <label className="form-label" htmlFor="genName">Energia tároló neve:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.name && nameState, "is-valid": nameState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.name })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="genName" id="genName" required maxLength={20} defaultValue={energyStorage?.name ?? ""} />
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
                    <div className="col-md-4 col-lg-3 mt-2">
                         <label className="form-label" htmlFor="storage_min">Minimális töltöttségi szint:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.storage_min && storage_minState, "is-valid": storage_minState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.storage_min })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="storage_min" id="storage_min" required defaultValue={energyStorage?.storage_min ?? ""} />
                         {
                              (state.errors?.storage_min && storage_minState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.storage_min.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-4 col-lg-3 mt-2">
                         <label className="form-label" htmlFor="storage_max">Maximális töltöttségi szint:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.storage_max && storage_maxState, "is-valid": storage_maxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.storage_max })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="storage_max" id="storage_max" required defaultValue={energyStorage?.storage_max ?? ""} />
                         {
                              (state.errors?.storage_max && storage_maxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.storage_max.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row">
                    <div className="col-lg-3 col-md-6 mt-2">
                         <label className="form-label" htmlFor="charge_max">Maximális töltés mértéke:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.charge_max && charge_maxState, "is-valid": charge_maxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.charge_max })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="charge_max" id="charge_max" required defaultValue={energyStorage?.charge_max ?? ""} />
                         {
                              (state.errors?.charge_max && charge_maxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.charge_max.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                         <label className="form-label" htmlFor="discharge_max">Maximális kisülés mértéke:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.discharge_max && discharge_maxState, "is-valid": discharge_maxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.discharge_max })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="discharge_max" id="discharge_max" required defaultValue={energyStorage?.discharge_max ?? ""} />
                         {
                              (state.errors?.discharge_max && discharge_maxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.discharge_max.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                         <label className="form-label" htmlFor="charge_loss">Töltési veszteségi együttható:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.charge_loss && charge_lossState, "is-valid": charge_lossState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.charge_loss })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="charge_loss" id="charge_loss" required defaultValue={energyStorage?.charge_loss ?? ""} />
                         {
                              (state.errors?.charge_loss && charge_lossState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.charge_loss.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                         <label className="form-label" htmlFor="discharge_loss">Kisülési veszteségi együttható:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.discharge_loss && discharge_lossState, "is-valid": discharge_lossState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.discharge_loss })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="discharge_loss" id="discharge_loss" required defaultValue={energyStorage?.discharge_loss ?? ""} />
                         {
                              (state.errors?.discharge_loss && discharge_lossState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.discharge_loss.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row align-items-end">
                    <div className="col-md-4 col-lg-3 mt-2">
                         <label className="form-label" htmlFor="charge_cost">Töltés költsége egységenként:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.charge_cost && charge_costState, "is-valid": charge_costState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.charge_cost })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="charge_cost" id="charge_cost" required defaultValue={energyStorage?.charge_cost ?? ""} />
                         {
                              (state.errors?.charge_cost && charge_costState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.charge_cost.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-4 col-lg-3 mt-2">
                         <label className="form-label" htmlFor="discharge_cost">Kisülés költsége egységenként:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.discharge_cost && discharge_costState, "is-valid": discharge_costState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.discharge_cost })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="discharge_cost" id="discharge_cost" required defaultValue={energyStorage?.discharge_cost ?? ""} />
                         {
                              (state.errors?.discharge_cost && discharge_costState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.discharge_cost.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-4 col-lg-6 mt-2">
                         <label className="form-label" htmlFor="s0">Kezdeti töltöttségi szint:</label>
                         <input className={clsx("form-control", { "is-invalid": state.errors?.s0 && s0State, "is-valid": s0State && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.s0 })} onClick={(e) => inputChange(e.currentTarget.name)} type="text" name="s0" id="s0" defaultValue={energyStorage?.s0 ?? ""} required />
                         {
                              (state.errors?.s0 && s0State) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.s0.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row mt-3 justify-content-between">
                    <div className="col-auto">
                         <Link className="btn btn-secondary" href="/simulate">Vissza</Link>
                    </div>
                    <div className="col"><hr /></div>
                    <div className="col-auto">
                         <button name="submitBtn" onClick={(e) => inputChange(e.currentTarget.name)} className={clsx("btn", { "btn-warning": action == "MODIFY" }, { "btn-success": action == "ADD" })} type="submit">{action == "ADD" ? "Hozzáadás" : "Módosítás"}</button>
                    </div>
               </div>
          </form>
     );
}