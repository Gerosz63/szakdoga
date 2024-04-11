import { getNewResult, getResultById } from "@/app/lib/actions";
import MainChart from "@/app/ui/charts/main_chart";
import { auth } from "@/auth";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default async function Page({ params }: { params: { id: string } }) {
     const isnew = params.id == "new";
     const session = await auth();

     const data = (isnew ? await getNewResult(+session?.user.id!) : await getResultById(+params.id, +session?.user.id!, session?.user.role!))
     const name = data.success ? data.result!.name : "-";


     return (
          <div className="container-fluid mt-3">
               <div className="row justify-content-center">
                    <div className="col-auto">
                         <h2>{isnew ? "Új eredmény" : `${name} eredmény`}</h2>
                    </div>
               </div>
               {
                    data.success &&
                    <form className="row align-items-center mt-4">
                         <div className="col">
                              <div className="form-floating">
                                   <input className="form-control" type="text" name="resName" id="resName" required maxLength={50} defaultValue={data.result!.name} />
                                   <label htmlFor="resName">Eredmény neve:</label>
                              </div>
                         </div>
                         <div className="col-auto">
                              <button className="btn btn-success btn-lg" type="submit"><FontAwesomeIcon icon={faFloppyDisk} /></button>
                         </div>
                    </form>
               }
               <div className="row justify-content-center">
                    {
                         !data.success ?
                              <div className="col-md-7">
                                   <div role="alert" className="alert alert-danger">
                                        {data.message}
                                   </div>
                              </div>
                              :
                              <div className="col-19" style={{height:"500px"}}>
                                   <MainChart data={data.result!.mainchart} />
                              </div>
                    }
               </div>
          </div>
     );
}