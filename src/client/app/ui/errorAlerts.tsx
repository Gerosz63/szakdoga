"use client";

import { Dispatch, SetStateAction } from "react";

export default function ErrorAlert({text, callback} : {text:string, callback: Dispatch<SetStateAction<{success: boolean; message: string;}>>}) {
     return (
           <div className="row bottom-0 position-fixed justify-content-end w-100" tabIndex={-2}>
               <div className="col-auto">
                    <div role="alert" className="alert alert-danger alert-dismissible">
                         <div>{text}</div>
                         <button type="button" className="btn-close" onClick={(e) => callback({success:true, message:""})} aria-label="Close"></button>
                    </div>
               </div>
           </div>
     );
}