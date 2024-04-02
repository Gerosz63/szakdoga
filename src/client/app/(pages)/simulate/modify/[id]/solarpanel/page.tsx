import { getGeneratorById } from "@/app/lib/actions";
import { SolarPanel } from "@/app/lib/definitions";
import Form from "@/app/ui/solarPanelForm";
import { auth } from "@/auth";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
     const user = await auth();
     const result = await getGeneratorById("SOLAR", +params.id, +user?.user.id!);
     const name = result.success ? result.result![0].name : "-";

     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center">
                    <div className="col-auto">
                         <h2>{name} nevű napelem módosítása</h2>
                    </div>
               </div>
               <hr />
               {
                    result.success ?
                         <div className="row justify-content-center">
                              <div className="col-md-9">
                                   <Form action="MODIFY" solarPanel={result.result![0] as SolarPanel} />
                              </div>
                         </div>
                         :
                         <>
                              <div className="row justify-content-center">
                                   <div className="col-md-5">
                                        <div className="alert alert-danger" role='alert'>A(z) {params.id} azonosítójú napelem nem érhető el!</div>
                                   </div>
                              </div>
                              <div className="row">
                                   <div className="col-auto">
                                        <Link className='btn btn-secondary' href="/simulate">Vissza</Link>
                                   </div>
                              </div>
                         </>

               }
          </div >
     );
}