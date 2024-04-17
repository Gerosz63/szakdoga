

export default function ListSkeleton() {
     return (
          <>
               <div className="fs-5 row justify-content-center border mt-2 rounded py-2 align-items-center shadow placeholder-glow">
                    <div className="col-lg-4 fw-bold"><span className="placeholder w-50"></span></div>
                    <div className="col-lg-4"><span className="placeholder w-50"></span></div>
                    <div className="col-lg-2"><span className="w-25 placeholder"></span>ms</div>
                    <div className="col-lg-2">
                         <div className="input-group justify-content-end placeholder-glow">
                              <button className="btn btn-secondary placeholder"></button>
                              <button className="btn btn-danger placeholder"></button>
                         </div>
                    </div>
               </div>
               <div className="fs-5 row justify-content-center border mt-2 rounded py-2 align-items-center shadow placeholder-glow">
                    <div className="col-lg-4 fw-bold"><span className="placeholder w-25"></span></div>
                    <div className="col-lg-4"><span className="placeholder w-50"></span></div>
                    <div className="col-lg-2"><span className="w-25 placeholder"></span>ms</div>
                    <div className="col-lg-2">
                         <div className="input-group justify-content-end placeholder-glow">
                              <button className="btn btn-secondary placeholder"></button>
                              <button className="btn btn-danger placeholder"></button>
                         </div>
                    </div>
               </div>
               <div className="fs-5 row justify-content-center border mt-2 rounded py-2 align-items-center shadow placeholder-glow">
                    <div className="col-lg-4 fw-bold"><span className="placeholder w-75"></span></div>
                    <div className="col-lg-4"><span className="placeholder w-50"></span></div>
                    <div className="col-lg-2"><span className="w-25 placeholder"></span>ms</div>
                    <div className="col-lg-2">
                         <div className="input-group justify-content-end placeholder-glow">
                              <button className="btn btn-secondary placeholder"></button>
                              <button className="btn btn-danger placeholder"></button>
                         </div>
                    </div>
               </div>
          </>
     );
}