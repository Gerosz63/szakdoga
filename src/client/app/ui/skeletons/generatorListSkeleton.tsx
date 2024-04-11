

export default function ListSkeleton() {
     return (
          <div className="border rounded-4 shadow px-2 py-3 mb-2">
               <div className="d-flex justify-content-between">
                    <h3 className="placeholder "></h3>
                    <div>
                         <a className="btn btn-outline-success disabled placeholder"></a>
                    </div>
               </div>
               <hr />
               <div className="container-fluid">
                    <div className="row align-items-center g-1 border rounded-4 py-2 px-1 mb-3">
                         <div className="col fs-4 ps-3">
                              <span className="placeholder"></span>
                         </div>
                         <div className="col-auto">
                              <div className="input-group">
                                   <a className="btn btn-outline-info placeholder"></a>
                                   <a className="btn btn-outline-warning placeholder"></a>
                                   <a className="btn btn-outline-danger placeholder"></a>
                                   <a className="btn btn-outline-secondary placeholder"></a>
                              </div>
                         </div>
                    </div>
                    <div className="row align-items-center g-1 border rounded-4 py-2 px-1 mb-3">
                         <div className="col fs-4 ps-3">
                              <span className="placeholder"></span>
                         </div>
                         <div className="col-auto">
                              <div className="input-group">
                                   <a className="btn btn-outline-info placeholder"></a>
                                   <a className="btn btn-outline-warning placeholder"></a>
                                   <a className="btn btn-outline-danger placeholder"></a>
                                   <a className="btn btn-outline-secondary placeholder"></a>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}