
export default function UserTableSkeleton() {
     return (
          <div className="container-fluid mb-4">
               <div className="row">
                    <div className="col-5 fw-bold">
                         Felhasználónév
                    </div>
                    <div className="col-3 fw-bold">
                         Szerepkör
                    </div>
                    <div className="col-1 fw-bold text-center">
                         Téma
                    </div>
               </div>
               <div className="row border rounded-4 shadow my-2 px-2 py-2 align-items-center placeholder-glow">
                    <div className="col-5 placeholder"></div>
                    <div className="col-3 placeholder"></div>
                    <div className="col-1 placeholder fs-4 text-center justify-content-center"></div>
                    <div className="col-3 placeholder">
                         <div className="input-group justify-content-end">
                              <button className="btn btn-warning placeholder" type="button"></button>
                              <button className="btn btn-danger placeholder" type="button"></button>
                         </div>
                    </div>
               </div>
          </div>
     );
}