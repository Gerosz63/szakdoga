"use client";

import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useFormState } from "react-dom";
import { saveResults } from "@/app/lib/actions";
import clsx from "clsx";
import Link from "next/link";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";


export default function Form({ id, name, saved }: { id: number, name: string, saved: boolean }) {
     const initialState: { message: string | null, error: string[] | null } = { message: null, error: null };
     const SaveWithId = saveResults.bind(null, id);
     const [state, dispatch] = useFormState(SaveWithId, initialState);


     const [savedState, SetSaved] = useState(saved);

     return (
          <form action={dispatch} className="row align-items-end mt-4">
               <div className="col-auto">
                    <Link className="btn btn-secondary" href="/simulate"><FontAwesomeIcon icon={faChevronLeft} /> Szimulátor</Link>
               </div>
               <div className="col">
                    <label className="form-label" htmlFor="resName">Eredmény neve:</label>
                    <input onChange={(e) => SetSaved(false)} className={clsx("form-control", { "is-invalid": savedState && state?.error != null})} type="text" name="resName" id="resName" required maxLength={50} defaultValue={name} />
                    {
                         (savedState && state?.error != null) &&
                         <div className="invalid-feedback">
                              {state.error!.map((e) => <p>{e}</p>)}
                         </div>
                    }
               </div>
               <div className="col-auto">
                    <button onClick={(e) => SetSaved(true)} className="btn btn-success" type="submit">Mentés <FontAwesomeIcon icon={faFloppyDisk} /></button>
               </div>
          </form>
     );
}