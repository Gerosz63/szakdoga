"use client";

import { useFormState } from "react-dom";
import { EnergyStorage, EnergyStorageState } from "@/app/lib/definitions";
import { useSession } from "next-auth/react";
import { addNewEnergyStorage, modifyEnergyStorage } from "@/app/lib/actions";
import { useState } from "react";
import Element from "@/app/ui/formElement";
import Submit from "@/app/ui/formSubmitElement";


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

     function inputChange() {
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
          state.errors = {};
     }

     return (
          <form action={dispatch} className="container-fluid">
               <div className="row">
                    <div className="col-md-4 col-lg-6 mt-2">
                         <Element name={"genName" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={nameState} setFunc={SetName} maxLen={20} required defaultValue={energyStorage?.name} />
                    </div>
                    <div className="col-md-4 col-lg-3 mt-2">
                         <Element name={"storage_min" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={storage_minState} setFunc={SetStorage_min} required defaultValue={energyStorage?.storage_min} />
                    </div>
                    <div className="col-md-4 col-lg-3 mt-2">
                         <Element name={"storage_max" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={storage_maxState} setFunc={SetStorage_max} required defaultValue={energyStorage?.storage_max} />
                    </div>
               </div>
               <div className="row">
                    <div className="col-lg-3 col-md-6 mt-2">
                         <Element name={"charge_max" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={charge_maxState} setFunc={SetCharge_max} required defaultValue={energyStorage?.charge_max} />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                         <Element name={"discharge_max" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={discharge_maxState} setFunc={SetDischarge_max} required defaultValue={energyStorage?.discharge_max} />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                         <Element name={"charge_loss" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={charge_lossState} setFunc={SetCharge_loss} required defaultValue={energyStorage?.charge_loss} />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                         <Element name={"discharge_loss" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={discharge_lossState} setFunc={SetDischarge_loss} required defaultValue={energyStorage?.discharge_loss} />
                    </div>
               </div>
               <div className="row">
                    <div className="col-md-4 col-lg-3 mt-2">
                         <Element name={"charge_cost" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={charge_costState} setFunc={SetCharge_cost} required defaultValue={energyStorage?.charge_cost} />
                    </div>
                    <div className="col-md-4 col-lg-3 mt-2">
                         <Element name={"discharge_cost" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={discharge_costState} setFunc={SetDischarge_cost} required defaultValue={energyStorage?.discharge_cost} />
                    </div>
                    <div className="col-md-4 col-lg-6 mt-2">
                         <Element name={"s0" as keyof EnergyStorage} type="STORAGE" state={state as EnergyStorageState} elemState={s0State} setFunc={SetS0} required defaultValue={energyStorage?.s0} />
                    </div>
               </div>
               <Submit action={action} href="/simulate" inputChange={inputChange} />
               {
                    state.errors!.general! &&
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
     );
}