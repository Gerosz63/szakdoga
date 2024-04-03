import clsx from "clsx";
import { EnergyStorageState, GasEngineState, SolarPanelState } from "@/app/lib/definitions";
import { Dispatch, SetStateAction } from "react";


export default function Element({ title, name, state, elemState, setFunc, required = true, maxLen }: { title: string, name: string | keyof EnergyStorageState | keyof GasEngineState | keyof SolarPanelState, state: EnergyStorageState | GasEngineState | SolarPanelState, elemState: boolean, setFunc: Dispatch<SetStateAction<boolean>>, required: boolean, maxLen?: number }) {

     return (
          <>
               <label className="form-label" htmlFor={name}>{title}</label>
               <input onChange={(e) => setFunc(false)} className={clsx("form-control", { "is-invalid": state.errors[name] && elemState, "is-valid": elemState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors[name] })} type="text" name={name} id={name} required={required} maxLength={maxLen} />
               {
                    (state.errors[name] && elemState) &&
                    <div className='invalid-feedback'>
                         {
                              state.errors[name].map((error: string) => (
                                   <p key={error}>
                                        {error}
                                   </p>
                              ))
                         }
                    </div>
               }
          </>
     );
}