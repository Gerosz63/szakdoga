"use client";
import { useFormState, useFormStatus } from 'react-dom';
import clsx from 'clsx';


export default function Page() {
     //const [errorMessage, dispatch] = useFormState(authenticate, undefined);
     const { pending } = useFormStatus();
     // {dispatch}, { "is-invalid": errorMessage }
     // {
     //      errorMessage &&
     //      (<div className='invalid-feedback'>
     //           {errorMessage}
     //      </div>)
     // }
     return (
          <main className="container-fluid mt-5">
               <div className="row justify-content-center">
                    <form action="" className="col-auto border border-secondary rounded shadow"> 
                         <div className="mb-1 mt-3 mx-2">
                              <label className="form-label" htmlFor="username">Felhasználó név:</label>
                              <input className={clsx("form-control")} type="text" name="username" id="username" required />
                         </div>
                         <div className="mb-3 mx-2">
                              <label className="form-label" htmlFor="password">Jelszó:</label>
                              <input className={clsx("form-control")} type="password" name="password" id="password" required />
                         </div>
                         <div className="mb-3 mx-2">
                              <button className="btn btn-primary w-100" type="submit" aria-disabled={pending}>Belépés</button>
                         </div>
                    </form>
               </div>
          </main>
     );
}

