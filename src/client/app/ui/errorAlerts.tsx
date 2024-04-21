"use client";

import { Dispatch, SetStateAction } from "react";

export default function ErrorAlert({text, callback} : {text:string, callback: Dispatch<SetStateAction<{success: boolean; message: string;}>>}) {
     return (
           <div className="row bottom-0 start-0 position-fixed justify-content-end w-100 m-0 p-0" tabIndex={-2}>
               <div className="col">
                    <div role="alert" className="alert alert-danger alert-dismissible">
                         <div className="fw-bold">{text}</div>
                         <button type="button" className="btn-close" onClick={(e) => callback({success:true, message:""})} aria-label="Close"></button>
                    </div>
               </div>
           </div>
     );
}