import { getGenerators } from "@/app/lib/actions";
import List from "@/app/ui/generatorList";
import DemandManager from "@/app/ui/demandManager";
import ListSkeleton from "@/app/ui/skeletons/generatorListSkeleton";
import { auth } from "@/auth";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { DbActionResult, EnergyStorage, GasEngine, SolarPanel } from "@/app/lib/definitions";

export default async function Page() {
     const mycookie = cookies();
     const localDemand = mycookie.get("demand")?.value ?? "";
     const user = await auth();
     const gasEngines = await getGenerators("GAS", +user?.user.id!);
     const solarPanels = await getGenerators("SOLAR", +user?.user.id!);
     const energyStorages = await getGenerators("STORE", +user?.user.id!);
     return (
          <div className="container-fluid">
               <h2 className="text-center mt-3 mb-5">Virtuális erőmű szimulátor</h2>
               <div className="row mb-3">
                    <div className="col">
                         <DemandManager uid={+user?.user.id!} localDemand={localDemand} />
                    </div>
               </div>
               <h3>Erőműveid</h3>
               <hr />
               <div className="row gx-2">
                    <div className="col-md-4">
                         {
                              gasEngines.success ?
                                   <Suspense key={"GAS_List"} fallback={<ListSkeleton />}>
                                        <List title="Gázmotorok" type="GAS" elements={gasEngines as DbActionResult<(SolarPanel | GasEngine | EnergyStorage)[]>} />
                                   </Suspense>
                                   :
                                   <ListSkeleton />
                         }
                    </div>
                    <div className="col-md-4">
                         {
                              energyStorages.success ?
                                   <Suspense key={"STORE_List"} fallback={<ListSkeleton />}>
                                        <List title="Energiatárolók" type="STORE" elements={energyStorages as DbActionResult<(SolarPanel | GasEngine | EnergyStorage)[]>} />
                                   </Suspense>
                                   :
                                   <ListSkeleton />
                         }
                    </div>
                    <div className="col-md-4">
                         {
                              solarPanels.success ?
                                   <Suspense key={"SOLAR_List"} fallback={<ListSkeleton />}>
                                        <List title="Napelemek" type="SOLAR" elements={solarPanels as DbActionResult<(SolarPanel | GasEngine | EnergyStorage)[]>} />
                                   </Suspense>
                                   :
                                   <ListSkeleton />
                         }
                    </div>
               </div>
               {
                    (!gasEngines.success || !energyStorages.success || !solarPanels.success) &&
                    <div className="bottom-0 position-fixed w-100 row px-2" tabIndex={-2}>
                         <div role='alert' className="alert alert-danger mt-4">
                              Adatbázis hiba!
                         </div>
                    </div>
               }
          </div>
     );
}