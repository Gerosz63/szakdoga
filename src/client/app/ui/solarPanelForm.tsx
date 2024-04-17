"use client";

import { SolarPanel, SolarPanelState } from "@/app/lib/definitions";
import { addNewSolarPanel, modifySolarPanel } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { useState } from "react";
import Element from "@/app/ui/formElement";
import Submit from "@/app/ui/formSubmitElement";

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

     function inputChange() {
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
     }


     return (
          <form action={dispatch} className="container-fluid">
               <div className="row">
                    <div className="col-md-6 mt-2">
                         <Element name={"genName"} type="SOLAR" state={state as SolarPanelState} elemState={nameState} setFunc={SetName} maxLen={20} required defaultValue={solarPanel?.name} />
                    </div>
                    <div className="col-md-6 mt-2">
                         <Element name={"r_max" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={r_maxState} setFunc={SetR_max} required defaultValue={solarPanel?.r_max} />
                    </div>
               </div>
               <div className="row align-items-end">
                    <div className="col-md-6 col-xl-3 mt-2">
                         <Element name={"delta_r_plus_max" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={delta_r_plus_maxState} setFunc={SetDelta_r_plus_max} required defaultValue={solarPanel?.delta_r_plus_max} />
                    </div>
                    <div className="col-md-6 col-xl-3 mt-2">
                         <Element name={"delta_r_minus_max" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={delta_r_minus_maxState} setFunc={SetDelta_r_minus_max} required defaultValue={solarPanel?.delta_r_minus_max} />
                    </div>
                    <div className="col-md-6 col-xl-3 mt-2">
                         <Element name={"cost" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={costState} setFunc={SetCost} required defaultValue={solarPanel?.cost} />
                    </div>
                    <div className="col-md-6 col-xl-3 mt-2">
                         <Element name={"r0" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={r0State} setFunc={SetR0} defaultValue={solarPanel?.r0} />
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
                         <Element name={"shift_start" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={shift_startState} setFunc={SetShift_start} required defaultValue={solarPanel?.shift_start ?? 0} />
                    </div>
                    <div className="col-md-4">
                         <Element name={"exp_v" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={exp_vState} setFunc={SetExp_v} required defaultValue={solarPanel?.exp_v ?? 12.5} />
                    </div>
                    <div className="col-md-4">
                         <Element name={"intval_range" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={intval_rangeState} setFunc={SetIntval_range} required defaultValue={solarPanel?.intval_range ?? 7} />
                    </div>
               </div>
               <div className="row mt-2 align-items-start">
                    <div className="col-md-5">
                         <Element name={"value_at_end" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={value_at_endState} setFunc={SetValue_at_end} required defaultValue={solarPanel?.value_at_end ?? 0.001} />
                    </div>
                    <div className="col-md-2">
                         <label className="form-label" htmlFor="addNoise">Zaj beállítása:</label>
                         <select onChange={(e) => SetAddNoise(false)} className={clsx("form-control", { "is-invalid": state.errors?.addNoise && addNoiseState, "is-valid": addNoiseState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.addNoise })} name="addNoise" id="addNoise" defaultValue={solarPanel?.value_at_end ?? "0"}>
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
                         <Element name={"seed" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={seedState} setFunc={SetSeed} defaultValue={solarPanel?.seed} />
                    </div>
               </div>
               <Submit action={action} href="/simulate" inputChange={inputChange} />
               {
                    state.errors.general &&
                    <div className="start-0 bottom-0 position-fixed w-100 row ps-3" tabIndex={-2}>
                         <div className="col">
                              {
                                   state.errors.general.map((error: string) => (
                                        <div role='alert' className="alert alert-danger mt-4" key={error}>
                                             {error}
                                        </div>
                                   ))
                              }
                         </div>
                    </div>
               }
          </form>
     )
}