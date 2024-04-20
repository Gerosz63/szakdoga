"use client";

import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useDebouncedCallback } from 'use-debounce';
import { z } from "zod";
import { SetDemandInCookie, simulate } from "@/app/lib/actions";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { LineChart } from "@mui/x-charts";
import ErrorAlert from "./errorAlerts";


export default function DemandManager({ uid, localDemand }: { uid: number, localDemand:string }) {
     
     const [demandState, SetDemand] = useState({ value: [] as number[], state: localDemand === "", error: [] as string[] });
     const [btnState, SetBtnState] = useState(false);
     const [simState, SetSimState] = useState({success:true, message: ""});


     useEffect(() => {
          if (localDemand !== "")
               onChangeHandler(localDemand);
     }, []);
     const onChangeHandler = useDebouncedCallback((value: string) => {
          const rawval = value.replace(/\s/g, "");
          if (rawval === "") {
               SetDemand({ value: [], state: true, error: [] });
               return;
          }
          const res = z.array(z.coerce.number({ invalid_type_error: "Csak számok adhatók meg!" }).nonnegative("Csak nemnegatív számok adhatók meg!")).safeParse(rawval.split(";").map((e) => e === "" ? undefined : e));

          if (res.success) {
               SetDemand({ value: res.data, state: false, error: [] });
               SetDemandInCookie(rawval);
          }
          else {
               let error_: { "Csak számok adhatók meg!": number[], "Csak nemnegatív számok adhatók meg!": number[] } = { "Csak számok adhatók meg!": [], "Csak nemnegatív számok adhatók meg!": [] };
               res.error.errors.forEach((e) => error_[e.message! as keyof { "Csak számok adhatók meg!": [number], "Csak nemnegatív számok adhatók meg!": [number] }]!.push(e.path[0] as number + 1));
               const res_error = [];
               if (error_["Csak nemnegatív számok adhatók meg!"].length !== 0)
                    res_error.push("Csak nemnegatív számok adhatók meg! (" + error_["Csak nemnegatív számok adhatók meg!"].join(", ") + ")");
               if (error_["Csak számok adhatók meg!"].length !== 0)
                    res_error.push("Csak számok adhatók meg! (" + error_["Csak számok adhatók meg!"].join(", ") + ")");
               SetDemand({ value: [], state: true, error: res_error });
          }

     }, 300);

     async function simulateOnclickHandler() {
          if (demandState.state)
               return;
          const res = await simulate(uid, demandState.value);
          if (res.error)
               SetSimState({success: false, message: res.error});
     }

     return (
          <>
               <h3>Várható fogyasztás</h3>
               <div className="container-fluid">
                    <div className="row align-items-center">
                         <div className="col"><hr /></div>
                         <div className="col-auto"><FontAwesomeIcon className="text-secondary fs-5" icon={faCircleInfo} /></div>
                         <div className="col"><hr /></div>
                    </div>
                    <div className="row justify-content-center mb-3">
                         <div className="col-md-6">
                              Új várható fogyasztás adatait pontosvesszővel, szóközök nélkül írd az alábbi mezőbe! (Pl.: "1200;1350.2;1500")
                         </div>
                    </div>
                    <div className="row g-2">
                         <div className="col">
                              <input onChange={(e) => onChangeHandler(e.target.value)} className={clsx(("form-control"), { "is-invalid": demandState.state && demandState.error.length !== 0, "is-valid": !demandState.state })} type="text" name="demand" id="demand" placeholder="1200;1350.2;1500" defaultValue={localDemand} />
                              {
                                   (demandState.state && demandState.error.length !== 0) &&
                                   <div className='invalid-feedback'>
                                        {
                                             demandState.error.map((e) =>
                                                  <p>{e}</p>
                                             )
                                        }
                                   </div>
                              }
                         </div>
                         <div className="col-auto">
                              <button data-bs-toggle="collapse" data-bs-target="#collapseDemand" aria-expanded="false" aria-controls="collapseDemand" onClick={e => SetBtnState(!btnState)} className="btn btn-secondary" type="button"><FontAwesomeIcon icon={!btnState ? faEye : faEyeSlash} /></button>
                         </div>
                    </div>
                    <div className="row justify-content-center collapse" id="collapseDemand">
                         <div className="col-9 bg-light shadow mt-2 rounded-4" style={{ height: "300px" }}>
                              <LineChart
                                   series={[
                                             {data: demandState.value, label: "Fogyasztás", curve: "step"}
                                        ]}
                                   xAxis={[
                                        { data: Array.from(Array(demandState.value.length).keys()) as number[], scaleType: "point", label: "Idő intervallum" }
                                   ]}
                                   yAxis={[
                                        { label: "Fogyaztás mértéke", min: 0, max: Math.max(...demandState.value) * 1.1, position: "left" }]}
                              />
                         </div>
                    </div>
               </div>
               <div className="row position-fixed bottom-0 w-100 mb-5 justify-content-center" tabIndex={-1}>
                    <div className="col-auto">
                         <button disabled={demandState.state} onClick={(e) => simulateOnclickHandler()} type="button" className="btn btn-lg btn-success shadow">Szimulál</button>
                    </div>
               </div>
               {
                    !simState.success &&
                    <ErrorAlert text={simState.message} callback={SetSimState}/>
               }
          </>
     );
}