"use client";

import { SolarPanel, SolarPanelState } from "@/app/lib/definitions";
import { addNewSolarPanel, modifySolarPanel } from "../lib/actions";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

export default function Form({ action, solarPanel }: { action: "ADD" | "MODIFY", solarPanel?: SolarPanel }) {

     const initialState: SolarPanelState = { message: null, errors: {} };
     const SolarPanelWithId = action == "ADD" ? addNewSolarPanel.bind(null, +useSession().data?.user.id!) : modifySolarPanel.bind(null, +solarPanel?.id!);
     const [state, dispatch] = useFormState(SolarPanelWithId, initialState);

     const [nameState, SetName] = useState(true);
     const [r_maxState, SetR_max] = useState(true);
     const [delta_r_plus_maxState, SetDelta_r_plus_max] = useState(true);
     const [delta_r_minus_maxState, SetDelta_r_minus_max] = useState(true);
     const [costState, SetCost] = useState(true);
     const [r0State, SetR0] = useState(true);
     const [shift_startState, SetShift_start] = useState(true);
     const [exp_vState, SetExp_v] = useState(true);
     const [intval_rangeState, SetIntval_range] = useState(true);
     const [value_at_endState, SetValue_at_end] = useState(true);
     const [addNoiseState, SetAddNoise] = useState(true);
     const [seedState, SetSeed] = useState(true);

     function inputChange(name: string) {
          console.log("Név: " + name);
          switch (name) {
               case "genName":
                    SetName(false);
                    break;
               case "r_max":
                    SetR_max(false);
                    break;
               case "delta_r_plus_max":
                    SetDelta_r_plus_max(false);
                    break;
               case "delta_r_minus_max":
                    SetDelta_r_minus_max(false);
                    break;
               case "cost":
                    SetCost(false);
                    break;
               case "r0":
                    SetR0(false);
                    break;
               case "shift_start":
                    SetShift_start(false);
                    break;
               case "exp_v":
                    SetExp_v(false);
                    break;
               case "intval_range":
                    SetIntval_range(false);
                    break;
               case "value_at_end":
                    SetValue_at_end(false);
                    break;
               case "addNoise":
                    SetAddNoise(false);
                    break;
               case "seed":
                    SetSeed(false);
                    break;

               case "submitBtn":
                    SetName(true);
                    SetR_max(true);
                    SetDelta_r_plus_max(true);
                    SetDelta_r_minus_max(true);
                    SetCost(true);
                    SetR0(true);
                    SetShift_start(true);
                    SetExp_v(true);
                    SetIntval_range(true);
                    SetValue_at_end(true);
                    SetAddNoise(true);
                    SetSeed(true);
                    break;
               default:
                    break;
          }
     }


     return (
          <form action={dispatch} className="container-fluid">
               <div className="row">
                    <div className="col-md-6 mt-2">
                         <label className="form-label" htmlFor="genName">Napelem neve:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.name && nameState, "is-valid": nameState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.name })} type="text" name="genName" id="genName" required maxLength={20} defaultValue={solarPanel?.name ?? ""} />
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
                    <div className="col-md-6 mt-2">
                         <label className="form-label" htmlFor="r_max">Maximális termelés:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.r_max && r_maxState, "is-valid": r_maxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.r_max })} type="text" name="r_max" id="r_max" required defaultValue={solarPanel?.r_max ?? ""} />
                         {
                              (state.errors?.r_max && r_maxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.r_max.map((error: string) => (
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
                    <div className="col-md-6 col-xl-3 mt-2">
                         <label className="form-label" htmlFor="delta_r_plus_max">Maximális felfutási ráta:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.delta_r_plus_max && delta_r_plus_maxState, "is-valid": delta_r_plus_maxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.delta_r_plus_max })} type="text" name="delta_r_plus_max" id="delta_r_plus_max" required defaultValue={solarPanel?.delta_r_plus_max ?? ""} />
                         {
                              (state.errors?.delta_r_plus_max && delta_r_plus_maxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.delta_r_plus_max.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-6 col-xl-3 mt-2">
                         <label className="form-label" htmlFor="delta_r_minus_max">Maximális lefutási ráta:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.delta_r_minus_max && delta_r_minus_maxState, "is-valid": delta_r_minus_maxState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.delta_r_minus_max })} type="text" name="delta_r_minus_max" id="delta_r_minus_max" required defaultValue={solarPanel?.delta_r_minus_max ?? ""} />
                         {
                              (state.errors?.delta_r_minus_max && delta_r_minus_maxState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.delta_r_minus_max.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-6 col-xl-3 mt-2">
                         <label className="form-label" htmlFor="cost">Költség megtermelt egységenként:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.cost && costState, "is-valid": costState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.cost })} type="text" name="cost" id="cost" required defaultValue={solarPanel?.cost ?? ""} />
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
                    <div className="col-md-6 col-xl-3 mt-2">
                         <label className="form-label" htmlFor="r0">Kezdeti termelés:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.r0 && r0State, "is-valid": r0State && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.r0 })} type="text" name="r0" id="r0" defaultValue={solarPanel?.r0 ?? ""} />
                         {
                              (state.errors?.r0 && r0State) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.r0.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row align-items-center justify-content-center">
                    <div className="col"><hr /></div>
                    <div className="col-auto">
                         <FontAwesomeIcon className="text-secondary fs-5" icon={faCircleInfo} />
                    </div>
                    <div className="col"><hr /></div>
               </div>
               <div className="row px-md-5 px-2">
                    <div className="col">
                         <h3 className="text-center">A napelemek működése</h3>
                         <p>A napelemek energiatermelését úgy szimuláljuk, hogy egy harangörbét veszünk alapul. Ennél a görbénél a</p>
                    </div>
               </div>
               <hr />
               <div className="row">
                    <div className="col-md-4">
                         <label className="form-label" htmlFor="shift_start">Eltolás mértéke:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.shift_start && shift_startState, "is-valid": shift_startState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.shift_start })} type="text" name="shift_start" id="shift_start" required defaultValue={solarPanel?.shift_start ?? "0"} />
                         {
                              (state.errors?.shift_start && shift_startState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.shift_start.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-4">
                         <label className="form-label" htmlFor="exp_v">Maximum helye:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.exp_v && exp_vState, "is-valid": exp_vState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.exp_v })} type="text" name="exp_v" id="exp_v" required defaultValue={solarPanel?.exp_v ?? "12.5"} />
                         {
                              (state.errors?.exp_v && exp_vState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.exp_v.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-4">
                         <label className="form-label" htmlFor="intval_range">Környezet mérete:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.intval_range && intval_rangeState, "is-valid": intval_rangeState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.intval_range })} type="text" name="intval_range" id="intval_range" required defaultValue={solarPanel?.intval_range ?? "7"} />
                         {
                              (state.errors?.intval_range && intval_rangeState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.intval_range.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row mt-2 align-items-start">
                    <div className="col-md-5">
                         <label className="form-label" htmlFor="value_at_end">Környezet szélén lévő érték:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.value_at_end && value_at_endState, "is-valid": value_at_endState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.value_at_end })} type="text" name="value_at_end" id="value_at_end" required defaultValue={solarPanel?.value_at_end ?? "0.0001"} />
                         {
                              (state.errors?.value_at_end && value_at_endState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.value_at_end.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-2">
                         <label className="form-label" htmlFor="addNoise">Zaj beállítása:</label>
                         <select onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.addNoise && addNoiseState, "is-valid": addNoiseState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.addNoise })} name="addNoise" id="addNoise" defaultValue={solarPanel?.value_at_end ?? "0"}>
                              <option value="1">Hozzáadás</option>
                              <option value="0">Elvétel</option>
                         </select>
                         {
                              (state.errors?.addNoise && addNoiseState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.addNoise.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
                    <div className="col-md-5">
                         <label className="form-label" htmlFor="seed">Seed értéke:</label>
                         <input onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.seed && seedState, "is-valid": seedState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.seed })} type="text" name="seed" id="seed" defaultValue={solarPanel?.seed ?? ""} />
                         {
                              (state.errors?.seed && seedState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors.seed.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               </div>
               <div className="row justify-content-between mt-4">
                    <div className="col-auto">
                         <Link className="btn btn-secondary" href="/simulate">Vissza</Link>
                    </div>
                    <div className="col"><hr /></div>
                    <div className="col-auto">
                         <button name="submitBtn" onClick={(e) => inputChange(e.currentTarget.name)} className={clsx("btn", { "btn-success": action == "ADD" }, { "btn-warning": action == "MODIFY" })} type="submit">{action == "ADD" ? "Hozzáadás" : "Módosítás"}</button>
                    </div>
               </div>
          </form>
     )
}