import clsx from "clsx";
import { EnergyStorage, EnergyStorageNameExchange, EnergyStorageState, GasEngine, GasEngineNameExchange, GasEngineState, SolarPanel, SolarPanelNameExchange, SolarPanelState } from "@/app/lib/definitions";
import { Dispatch, SetStateAction } from "react";


export default function Element(
     {
          type, name, state, elemState, setFunc, maxLen, required, defaultValue
     }:
          {
               type: "GAS" | "SOLAR" | "STORAGE",
               name: keyof EnergyStorage | keyof GasEngine | keyof SolarPanel | "genName",
               state: EnergyStorageState | GasEngineState | SolarPanelState,
               elemState: boolean, setFunc: Dispatch<SetStateAction<boolean>>,
               required?: boolean,
               maxLen?: number,
               defaultValue: string | undefined | number
          }) {
     let title: string | number | boolean = "";
     switch (type) {
          case "GAS":
               title = GasEngineNameExchange[(name == "genName" ? "name" : name) as (keyof GasEngine)];
               break;
          case "SOLAR":
               title = SolarPanelNameExchange[(name == "genName" ? "name" : name) as (keyof SolarPanel)];
               break;
          case "STORAGE":
               title = EnergyStorageNameExchange[(name == "genName" ? "name" : name) as (keyof EnergyStorage)];
               break;
          default:
               break;
     }
     return (
          <>
               <label className="form-label" htmlFor={name}>{title}:</label>
               <input onChange={(e) => setFunc(false)} className={clsx("form-control", { "is-invalid": state.errors[name] && elemState, "is-valid": elemState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors[name] })} type="text" name={name} id={name} required={required} maxLength={maxLen} defaultValue={defaultValue ?? ""} />
               {
                    (state.errors[name] && elemState) &&
                    <div className='invalid-feedback'>
                         {
                              state.errors![name].map((error: string) => (
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