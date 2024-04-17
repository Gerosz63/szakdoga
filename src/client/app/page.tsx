import Link from "next/link";

export default function Page() {
     return (
          <div className="container-fluid vh-100 align-content-center">
               <div className="row justify-content-center">
                    <div className="col-4 border rounded p-3 shadow">
                         <div className="row">
                              
                              <h2>
                                   Lépj be egy optimálisabb világab!
                              </h2>
                         </div>
                         <hr />
                         <div className="row">
                              <div className="col">
                                   <Link className="btn btn-primary w-100" href="/login">Belépek!</Link>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}