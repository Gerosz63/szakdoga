import clsx from "clsx";
import { EnergyStorage, EnergyStorageNameExchange, EnergyStorageState, EnergyStorageStateError, GasEngine, GasEngineNameExchange, GasEngineState, GasEngineStateError, SolarPanel, SolarPanelNameExchange, SolarPanelState, SolarPanelStateError } from "@/app/lib/definitions";
import { Dispatch, SetStateAction } from "react";


export default function Element(
     {
          type, name, state, elemState, setFunc, maxLen, required, defaultValue, sendValue, onChangeFunc
     }:
          {
               type: "GAS" | "SOLAR" | "STORAGE",
               name: keyof EnergyStorage | keyof GasEngine | keyof SolarPanel | "genName",
               state: EnergyStorageState | GasEngineState | SolarPanelState,
               elemState: boolean,
               setFunc: Dispatch<SetStateAction<boolean>> | Dispatch<SetStateAction<{ state: boolean, value: string }>>,
               required?: boolean,
               maxLen?: number,
               defaultValue: string | undefined | number,
               sendValue?: boolean,
               onChangeFunc?: () => void
          }) {
     let title: string | number | boolean = "";
     const name_help = (name == "genName" ? "name" : name) as keyof GasEngine | keyof SolarPanel | keyof EnergyStorage;
     let name_err = name_help as (keyof GasEngineStateError | keyof SolarPanelStateError | keyof EnergyStorageStateError);
     let error_list: string[] | undefined = undefined;
     switch (type) {
          case "GAS":
               title = GasEngineNameExchange[name_help as (keyof GasEngine)];
               error_list = (state as GasEngineState).errors![name_err as (keyof GasEngineStateError)];
               break;
          case "SOLAR":
               title = SolarPanelNameExchange[name_help as (keyof SolarPanel)];
               error_list = (state as SolarPanelState).errors![name_err as (keyof SolarPanelStateError)];
               break;
          case "STORAGE":
               title = EnergyStorageNameExchange[name_help as (keyof EnergyStorage)];
               error_list = (state as EnergyStorageState).errors![name_err as (keyof EnergyStorageStateError)];
               break;
          default:
               break;
     }
     return (
          <>
               <label className={clsx("form-label", { "required  fw-bold": required })} htmlFor={name}>{title}:</label>
               <input onChange={(e) => {
                    if (sendValue)
                         (setFunc as Dispatch<SetStateAction<{ state: boolean, value: string }>>)({ state: false, value: e.target.value });
                    else
                         (setFunc as Dispatch<SetStateAction<boolean>>)(false);
                    if (onChangeFunc)
                         onChangeFunc();
               }} className={clsx("form-control", { "is-invalid": error_list && elemState, "is-valid": elemState && Object.keys(state.errors ?? {}).length !== 0 && !error_list })} type="text" name={name} id={name} required={required} maxLength={maxLen} defaultValue={defaultValue ?? ""} />


               {
                    (error_list && elemState) &&
                    <div className='invalid-feedback'>
                         {
                              error_list.map((error: string) => (
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