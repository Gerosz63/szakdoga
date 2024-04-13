import { getResults } from "@/app/lib/actions";
import List from "@/app/ui/resulstList";
import { auth } from "@/auth";


export default async function Page() {
     const session = await auth()
     const res = await getResults(+session?.user.id!);


     return (
          <div className="container-fluid">
               <div className="row">
                    <div className="col text-center">
                         <h1>Eredmények</h1>
                    </div>
               </div>
               <div className="row justify-content-center">
                    <div className="col-md-9">
                         <div className="container-fluid">
                              {
                                   res.success && res.result?.length != 0 ?
                                        <List results={res.result!} />
                                        :
                                        <div className="row justify-content-center">
                                             <div className="col-auto">
                                                  <h5>Nincs még mentett szimulációd!</h5>
                                             </div>
                                        </div>
                              }
                         </div>
                    </div>
               </div>
          </div>
     );
}