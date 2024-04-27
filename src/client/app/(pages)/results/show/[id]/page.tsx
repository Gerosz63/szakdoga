import { getNewResult, getResultById, sumArrayElementsByIndex } from "@/app/lib/actions";
import { EnergyStorage, GasEngine, SolarPanel } from "@/app/lib/definitions";
import { ElementChart } from "@/app/ui/charts";
import { MainChart } from "@/app/ui/charts";
import { StorageChart } from "@/app/ui/charts";
import List from "@/app/ui/readonlyGeneratorList";
import Form from "@/app/ui/saveResultFrom";
import ChartSkeleton from "@/app/ui/skeletons/chartSkeleton";
import ListSkeleton from "@/app/ui/skeletons/generatorListSkeleton";
import { auth } from "@/auth";
import { Suspense } from "react";


export default async function Page({ params }: { params: { id: string } }) {
     const isnew = params.id == "new";
     const session = await auth();


     const data = (isnew ? await getNewResult(+session?.user.id!) : await getResultById(+params.id, +session?.user.id!, session?.user.role!))
     const name = data.success ? data.result!.name : "-";
     const date = data.success ? data.result!.saveDate.toISOString().replace("T", " ").replace(".000Z", "") : "-";
     const exec_time = data.success ? data.result!.exec_time : "-";
     const mainChart_data: { name: string, data: number[] }[] = [];
     let gasEngines: GasEngine[] = [];
     let energyStorages: EnergyStorage[] = [];
     let solarPanels: SolarPanel[] = [];
     if (data.success) {
          const shorts: ("GAS" | "SOLAR" | "STORAGE")[] = ["STORAGE", "GAS", "SOLAR"];
          for (let i = 0; i < 3; i++) {
               const key: "GAS" | "SOLAR" | "STORAGE" = shorts[i];
               if (data.result!.elementTypes[key]) {
                    if (mainChart_data.length == 0) {
                         if (key == "STORAGE")
                              mainChart_data.push({ name: data.result?.sumByType.STORAGE.produce.name!, data: data.result?.sumByType.STORAGE.produce.data! });
                         else
                              mainChart_data.push({ name: data.result?.sumByType[key as "GAS" | "SOLAR"].name!, data: data.result?.sumByType[key as "GAS" | "SOLAR"].data! });
                    }
                    else {
                         if (key == "STORAGE")
                              mainChart_data.push({ name: data.result?.sumByType.STORAGE.produce.name!, data: await sumArrayElementsByIndex([data.result?.sumByType.STORAGE.produce.data!, mainChart_data.at(-1)!.data]) });
                         else
                              mainChart_data.push({ name: data.result?.sumByType[key as "GAS" | "SOLAR"].name!, data: await sumArrayElementsByIndex([data.result?.sumByType[key as "GAS" | "SOLAR"].data!, mainChart_data.at(-1)!.data]) });
                    }
               }
          }
          gasEngines = data.result!.generators.GAS;
          energyStorages = data.result!.generators.STORAGE;
          solarPanels = data.result!.generators.SOLAR;

     }

     function dublicateFirstItem(array: number[]) {
          return [array[0], ...array];
     }

     return (
          <div className="container-fluid mt-3">
               <div className="row justify-content-between">
                    <div className="col">
                         <h3 className="mb-0">{date}</h3>
                         <p className="text-body-secondary mt-0 pt-0">Szimuláció dátuma</p>
                    </div>
                    <div className="col text-center">
                         <h1>{isnew ? "Új eredmény" : `${name} eredmény`}</h1>
                    </div>
                    <div className="col text-end">
                         <h3 className="mb-0">{`${exec_time == "-" ? "-" : Math.ceil(exec_time * 1000) / 1000} ms`}</h3>
                         <p className="text-body-secondary mt-0 pt-0">Szimuláció hossza</p>
                    </div>
               </div>
               {
                    data.success &&
                    <Form id={data.result!.id} name={data.result?.name ?? ""} saved={data.result?.name != undefined} />
               }
               <div className="row justify-content-center my-5">
                    {
                         !data.success ?
                              <div className="col-md-7">
                                   <div role="alert" className="alert alert-danger">
                                        {data.message}
                                   </div>
                              </div>
                              :
                              <>
                                   <div className="col-11">
                                        <div className="row align-items-center gx-0 my-3">
                                             <div className="col"><hr /></div>
                                             <div className="bg-light col-auto border-start border-end px-2 rounded-3 shadow py-2"><h3 className="p-0 m-0">Összesített eredmények</h3></div>
                                             <div className="col"><hr /></div>
                                        </div>
                                        <div style={{ height: "400px" }} className="mybg-white rounded-4">
                                             <Suspense fallback={<ChartSkeleton />}>
                                                  <MainChart data={{ xLabels: data.result!.labels, chartdata: mainChart_data.map((e) => { return { name: e.name, data: dublicateFirstItem(e.data) }; }), demand: dublicateFirstItem(data.result!.demand) }} />
                                             </Suspense>
                                        </div>
                                   </div>
                                   {
                                        data.result!.elementTypes.GAS &&
                                        <div className="col-11 my-3">
                                             <div className="row align-items-center gx-0 mb-3">
                                                  <div className="col"><hr /></div>
                                                  <div className="bg-light col-auto border-start border-end px-2 rounded-3 shadow py-2"><h3 className="p-0 m-0">Gázmotorok eredményei</h3></div>
                                                  <div className="col"><hr /></div>
                                             </div>
                                             <div style={{ height: "400px" }} className="mybg-white rounded-4 ">
                                                  <Suspense fallback={<ChartSkeleton />}>
                                                       <ElementChart data={{ xLabels: data.result!.labels, chartdata: data.result!.elements.GAS.map((e) => { return { name: e.name, data: dublicateFirstItem(e.data) }; }) }} />
                                                  </Suspense>
                                             </div>
                                        </div>
                                   }
                                   {
                                        data.result!.elementTypes.STORAGE &&
                                        <div className="col-11 my-3">
                                             <div className="row align-items-center gx-0 mb-3">
                                                  <div className="col"><hr /></div>
                                                  <div className="bg-light col-auto border-start border-end px-2 rounded-3 shadow py-2"><h3 className="p-0 m-0">Energia tárolók eredményei</h3></div>
                                                  <div className="col"><hr /></div>
                                             </div>
                                             <div style={{ height: "400px" }} className="mybg-white rounded-4">
                                                  <Suspense fallback={<ChartSkeleton />}>
                                                       <StorageChart data={{
                                                            xLabels: data.result!.labels, chartdata: [
                                                                 ...data.result!.elements.STORAGE.map((e) => { return { name: e.name + " töltés", data: dublicateFirstItem(e.data.charge) }; }),
                                                                 ...data.result!.elements.STORAGE.map((e) => { return { name: e.name + " kisütés", data: dublicateFirstItem(e.data.discharge) }; })
                                                            ], store: data.result!.elements.STORAGE.map((e) => { return { name: e.name + " töltöttség", data: dublicateFirstItem(e.data.store) }; })
                                                       }} />
                                                  </Suspense>
                                             </div>
                                        </div>
                                   }
                                   {
                                        data.result!.elementTypes.SOLAR &&
                                        <div className="col-11 mt-3 mb-5" style={{ height: "400px" }}>
                                             <div className="row align-items-center gx-0 mb-3">
                                                  <div className="col"><hr /></div>
                                                  <div className="bg-light col-auto border-start border-end px-2 rounded-3 shadow py-2"><h3 className="p-0 m-0">Napelemek eredményei</h3></div>
                                                  <div className="col"><hr /></div>
                                             </div>
                                             <div style={{ height: "400px" }} className="mybg-white rounded-4">
                                                  <Suspense fallback={<ChartSkeleton />}>
                                                       <ElementChart data={{ xLabels: data.result!.labels, chartdata: data.result!.elements.SOLAR.map((e) => { return { name: e.name, data: dublicateFirstItem(e.data) }; }) }} />
                                                  </Suspense>
                                             </div>
                                        </div>
                                   }
                              </>
                    }
               </div>
               {
                    data.success &&
                    <>
                         <div className="row align-items-center gx-0 mt-5">
                              <div className="col"><hr /></div>
                              <div className="bg-light col-auto border-start border-end px-2 rounded-3 shadow py-2"><h3 className="p-0 m-0">Generátorok</h3></div>
                              <div className="col"><hr /></div>
                         </div>
                         <div className="row gx-2 my-5">
                              {
                                   gasEngines.length != 0 &&
                                   <div className="col-md-4">
                                        <Suspense key={"GAS_List"} fallback={< ListSkeleton />}>
                                             <List title="Gázmotorok" type="GAS" elements={gasEngines} />
                                        </Suspense>
                                   </div>
                              }
                              {
                                   energyStorages.length != 0 &&
                                   <div className="col-md-4">
                                        <Suspense key={"STORE_List"} fallback={< ListSkeleton />}>
                                             <List title="Energiatárolók" type="STORE" elements={energyStorages} />
                                        </Suspense>
                                   </div>
                              }
                              {
                                   solarPanels.length != 0 &&
                                   <div className="col-md-4">
                                        <Suspense key={"SOLAR_List"} fallback={< ListSkeleton />}>
                                             <List title="Napelemek" type="SOLAR" elements={solarPanels} />
                                        </Suspense>
                                   </div>
                              }
                         </div>
                    </>
               }
          </div>
     );
}