import { getGenerators } from "@/app/lib/actions";
import List from "@/app/ui/generatorList";
import DemandManager from "@/app/ui/potentialDemandManager";
import ListSkeleton from "@/app/ui/skeletons/generatorListSkeleton";
import { auth } from "@/auth";
import { Suspense } from "react";

export default async function Page() {
     const user = await auth();
     const gasEngines = await getGenerators("GAS", +user?.user.id!);
     const solarPanels = await getGenerators("SOLAR", +user?.user.id!);
     const energyStorages = await getGenerators("STORE", +user?.user.id!);
     const session = await auth();
     return (
          <div className="container-fluid">
               <h2 className="text-center mt-3 mb-5">Virtuális erőmű szimulátor</h2>
               <div className="row">
                    <div className="col">
                         <DemandManager uid={+session?.user.id!}/>
                    </div>
               </div>
               <hr />
               <div className="row gx-2">
                    <div className="col-md-4">
                         <Suspense key={"GAS_List"} fallback={< ListSkeleton />}>
                              <List title="Gázmotorok" type="GAS" elements={gasEngines} />
                         </Suspense>
                    </div>
                    <div className="col-md-4">
                         <Suspense key={"STORE_List"} fallback={< ListSkeleton />}>
                              <List title="Energiatárolók" type="STORE" elements={energyStorages} />
                         </Suspense>
                    </div>
                    <div className="col-md-4">
                         <Suspense key={"SOLAR_List"} fallback={< ListSkeleton />}>
                              <List title="Napelemek" type="SOLAR" elements={solarPanels} />
                         </Suspense>
                    </div>
               </div>
          </div>
     );
}