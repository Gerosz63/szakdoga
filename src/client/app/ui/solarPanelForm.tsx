"use client";

import { SolarPanel, SolarPanelState, SolarPanelValueNameExchange, SolarValueErrorState } from "@/app/lib/definitions";
import { addNewSolarPanel, GetSolarValues, modifySolarPanel } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { useState } from "react";
import Element from "@/app/ui/formElement";
import Submit from "@/app/ui/formSubmitElement";
import Link from "next/link";
import { ElementChart } from "@/app/ui/charts";
import { useDebouncedCallback } from 'use-debounce';

export default function Form({ action, solarPanel }: { action: "ADD" | "MODIFY", solarPanel?: SolarPanel }) {

     const initialState: SolarPanelState = { message: null, errors: {} };
     const SolarPanelWithId = action == "ADD" ? addNewSolarPanel.bind(null, +useSession().data?.user.id!) : modifySolarPanel.bind(null, +solarPanel?.id!);
     const [state, dispatch] = useFormState(SolarPanelWithId, initialState);

     const [nameState, SetName] = useState(true);
     const [r_maxState, SetR_max] = useState({ state: true, value: solarPanel?.r_max.toString() ?? "0" });
     const [delta_r_plus_maxState, SetDelta_r_plus_max] = useState(true);
     const [delta_r_minus_maxState, SetDelta_r_minus_max] = useState(true);
     const [costState, SetCost] = useState(true);
     const [r0State, SetR0] = useState(true);
     const [shift_startState, SetShift_start] = useState({ state: true, value: solarPanel?.shift_start.toString() ?? "0" });
     const [exp_vState, SetExp_v] = useState({ state: true, value: solarPanel?.exp_v.toString() ?? "12.5" });
     const [intval_rangeState, SetIntval_range] = useState({ state: true, value: solarPanel?.intval_range.toString() ?? "7" });
     const [value_at_endState, SetValue_at_end] = useState({ state: true, value: solarPanel?.value_at_end.toString() ?? "0.001" });
     const [addNoiseState, SetAddNoise] = useState({ state: true, value: solarPanel?.addNoise.toString() ?? "0" });
     const [seedState, SetSeed] = useState({ state: true, value: solarPanel?.seed.toString() ?? "" });


     const [t, SetT] = useState("24");
     const [chartData, SetData] = useState({ xLabels: Array.from(Array(25).keys()) as number[], chartdata: [{ name: "Napelem termelése", data: Array(25).fill(0) }] })
     const [chartError, SetChartError] = useState(null as SolarValueErrorState | null);

     function Parameternull(val: string) {
          return val == "" ? null : val;
     }

     const reDrawChart = useDebouncedCallback(async () => {
          const data = await GetSolarValues(Parameternull(t), Parameternull(value_at_endState.value), Parameternull(exp_vState.value), Parameternull(shift_startState.value), Parameternull(r_maxState.value), addNoiseState.value == '1', Parameternull(seedState.value), Parameternull(intval_rangeState.value));

          if (data.success) {
               SetData({ xLabels: data.result!.labels, chartdata: [{ name: "Napelem termelése", data: data.result!.data }] })
               SetChartError(null);
          }
          else
               SetChartError(data.error!);
     }, 500);

     function inputChange() {
          SetName(true);
          SetR_max({ state: true, value: r_maxState.value });
          SetDelta_r_plus_max(true);
          SetDelta_r_minus_max(true);
          SetCost(true);
          SetR0(true);
          SetShift_start({ state: true, value: shift_startState.value });
          SetExp_v({ state: true, value: exp_vState.value });
          SetIntval_range({ state: true, value: intval_rangeState.value });
          SetValue_at_end({ state: true, value: value_at_endState.value });
          SetAddNoise({ state: true, value: addNoiseState.value });
          SetSeed({ state: true, value: seedState.value });
          state.errors = {};
     }


     return (
          <form action={dispatch} className="container-fluid">
               <div className="row">
                    <div className="col-md-6 mt-2">
                         <Element name={"genName"} type="SOLAR" state={state as SolarPanelState} elemState={nameState} setFunc={SetName} maxLen={20} required defaultValue={solarPanel?.name} />
                    </div>
                    <div className="col-md-6 mt-2">
                         <Element name={"r_max" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={r_maxState.state} setFunc={SetR_max} required defaultValue={solarPanel?.r_max} sendValue onChangeFunc={reDrawChart} />
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
                         <Link data-bs-toggle="collapse" href="#collapseInfo" role="button" aria-expanded="false" aria-controls="collapseInfo"><FontAwesomeIcon className="text-secondary bg-light fs-5" icon={faCircleInfo} /></Link>
                    </div>
                    <div className="col"><hr /></div>
               </div>
               <div id="collapseInfo" className="row px-md-5 px-2 collapse gy-3">
                    <div className="col-12">
                         <h3 className="text-center">A napelemek működése</h3>
                         <p>A napelemek energiatermelését úgy szimuláljuk, hogy egy harangörbét veszünk alapul. Ennél a görbénél meg kell adnunk a <b>Maximum helyét</b>, illetve azt a <b>sugarat</b> melyen belül a görbe pozitív értéket vegyen fel a csúcspont körül. Ezen felül kell még egy minél kisebb pozitív szám, melyet az említett harangröbe fell kell, hogy vegyen az intervallum szélein. Ezt követően eltólhatjuk a görbét, valamint zajjal is elláthatjuk.</p>
                    </div>
                    <div className="col-12 form-inline">
                         <div className="row justify-content-center">
                              <label className="col-auto col-form-label" htmlFor="t">Időintervallumok száma:</label>
                              <div className="col-auto">
                                   <input onChange={(e) => { SetT(e.target.value); reDrawChart(); }} className="form-control text-end" type="text" name="t" id="t" defaultValue={t} />
                              </div>
                         </div>
                    </div>
                    <div className="col-12" style={{ height: "400px" }}>
                         <ElementChart data={chartData} />
                    </div>
                    <div className="col-12">
                         {
                              chartError &&
                              <>
                                   <div role="alert" className="alert alert-danger">A diagram nem kirajzolható!</div>
                                   {
                                        Object.keys(chartError).map(e => {
                                             let k = e as keyof SolarValueErrorState;


                                             return (
                                                  <div key={k} role="alert" className="alert alert-danger">
                                                       <b>{SolarPanelValueNameExchange[k]}</b>
                                                       <ul>
                                                            {
                                                                 chartError[k]?.map((e, i) => <li key={k + i}>{e}</li>)
                                                            }
                                                       </ul>
                                                  </div>
                                             );
                                        })
                                   }
                              </>
                         }
                    </div>
                    <hr />
               </div>

               <div className="row">
                    <div className="col-md-4">
                         <Element name={"shift_start" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={shift_startState.state} setFunc={SetShift_start} required defaultValue={solarPanel?.shift_start ?? 0} sendValue onChangeFunc={reDrawChart} />
                    </div>
                    <div className="col-md-4">
                         <Element name={"exp_v" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={exp_vState.state} setFunc={SetExp_v} required defaultValue={solarPanel?.exp_v ?? 12.5} sendValue onChangeFunc={reDrawChart} />
                    </div>
                    <div className="col-md-4">
                         <Element name={"intval_range" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={intval_rangeState.state} setFunc={SetIntval_range} required defaultValue={solarPanel?.intval_range ?? 7} sendValue onChangeFunc={reDrawChart} />
                    </div>
               </div>
               <div className="row mt-2 align-items-start">
                    <div className="col-md-5">
                         <Element name={"value_at_end" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={value_at_endState.state} setFunc={SetValue_at_end} required defaultValue={solarPanel?.value_at_end ?? 0.001} sendValue onChangeFunc={reDrawChart} />
                    </div>
                    <div className="col-md-2">
                         <label className="form-label" htmlFor="addNoise">Zaj beállítása:</label>
                         <select onChange={(e) => { SetAddNoise({ state: false, value: e.target.value }); reDrawChart(); }} className={clsx("form-control", { "is-invalid": state.errors?.addNoise && addNoiseState, "is-valid": addNoiseState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.addNoise })} name="addNoise" id="addNoise" defaultValue={solarPanel?.value_at_end ?? "0"}>
                              <option value="1">Zajosítás</option>
                              <option value="0">Nem használom</option>
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
                         <Element name={"seed" as keyof SolarPanel} type="SOLAR" state={state as SolarPanelState} elemState={seedState.state} setFunc={SetSeed} defaultValue={solarPanel?.seed} sendValue onChangeFunc={reDrawChart} />
                    </div>
               </div>
               <Submit action={action} href="/simulate" inputChange={inputChange} />
               {
                    state.errors!.general &&
                    <div className="start-0 bottom-0 position-fixed w-100 row ps-3" tabIndex={-2}>
                         <div className="col">
                              {
                                   state.errors!.general.map((error: string) => (
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