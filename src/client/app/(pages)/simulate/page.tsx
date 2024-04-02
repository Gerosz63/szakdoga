import { getGenerators } from "@/app/lib/actions";
import List from "@/app/ui/generatorList";
import { auth } from "@/auth";
import { Suspense } from "react";

export default async function Page() {
     const user = await auth();
     const gasEngines = await getGenerators("GAS", +user?.user.id!);
     const solarPanels = await getGenerators("SOLAR", +user?.user.id!);
     const energyStorages = await getGenerators("STORE", +user?.user.id!);
     return (
          <div className="container-fluid">
               <div className="row gx-2">
                    <div className="col-md-4">
                         <Suspense>
                              <List title="Gázmotorok" type="GAS" elements={gasEngines} />
                         </Suspense>
                    </div>
                    <div className="col-md-4">
                         <Suspense>
                              <List title="Energiatárolók" type="STORE" elements={energyStorages} />
                         </Suspense>
                    </div>
                    <div className="col-md-4">
                         <Suspense>
                              <List title="Napelemek" type="SOLAR" elements={solarPanels} />
                         </Suspense>
                    </div>
               </div>
          </div>
     );
}