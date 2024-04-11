"use client";

import { addNewGasEngine, modifyGasEngine } from "@/app/lib/actions";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { GasEngine, GasEngineState } from "../lib/definitions";
import { useState } from "react";
import Element from "./formElement";
import Submit from "./formSubmitElement";


export default function Form({ action, gasEngine }: { action: "ADD" | "MODIFY", gasEngine?: GasEngine }) {
     const initialState: GasEngineState = { message: null, errors: {} };
     const GasEngineWithId = action == "ADD" ? addNewGasEngine.bind(null, +useSession().data?.user.id!) : modifyGasEngine.bind(null, +gasEngine?.id!);
     const [state, dispatch] = useFormState(GasEngineWithId, initialState);


     const [nameState, SetName] = useState(true);
     const [gmaxState, SetGmax] = useState(true);
     const [gplusmaxState, SetGplusmax] = useState(true);
     const [gminusmaxState, SetGminusmax] = useState(true);
     const [costState, SetCost] = useState(true);
     const [g0State, SetG0] = useState(true);

     function inputChange() {
          SetName(true);
          SetGmax(true);
          SetGplusmax(true);
          SetGminusmax(true);
          SetCost(true);
          SetG0(true);

     }

     return (
          <form action={dispatch} className="container-fluid">
               <div className="row mb-2">
                    <div className="col-md">
                         <Element name={"genName" as keyof GasEngine} type="GAS" state={state as GasEngineState} elemState={nameState} setFunc={SetName} maxLen={20} required defaultValue={gasEngine?.name} />
                    </div>
                    <div className="col-md">
                         <Element name={"gmax" as keyof GasEngine} type="GAS" state={state as GasEngineState} elemState={gmaxState} setFunc={SetGmax} required defaultValue={gasEngine?.gmax} />
                    </div>
               </div>
               <div className="row mb-2">
                    <div className="col-md">
                         <Element name={"gplusmax" as keyof GasEngine} type="GAS" state={state as GasEngineState} elemState={gplusmaxState} setFunc={SetGplusmax} required defaultValue={gasEngine?.gplusmax} />
                    </div>
                    <div className="col-md">
                         <Element name={"gminusmax" as keyof GasEngine} type="GAS" state={state as GasEngineState} elemState={gminusmaxState} setFunc={SetGminusmax} required defaultValue={gasEngine?.gminusmax} />
                    </div>
               </div>
               <div className="row mb-4">
                    <div className="col-md">
                         <Element name={"cost" as keyof GasEngine} type="GAS" state={state as GasEngineState} elemState={costState} setFunc={SetCost} required defaultValue={gasEngine?.cost} />
                    </div>
                    <div className="col-md">
                         <Element name={"g0" as keyof GasEngine} type="GAS" state={state as GasEngineState} elemState={g0State} setFunc={SetG0} defaultValue={gasEngine?.g0} />
                    </div>
               </div>
               <Submit action={action} href="/simulate" inputChange={inputChange} />
          </form>
     );
}