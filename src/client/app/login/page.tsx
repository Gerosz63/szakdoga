"use client";
import { useFormState, useFormStatus } from 'react-dom';
import clsx from 'clsx';
import { login } from '@/app/lib/actions';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams} from 'next/navigation';
import { defaultLoginRedirect } from '../lib/definitions';


export default function Page() {
     const [errorMessage, dispatch] = useFormState(login, undefined);
     const searchParams = useSearchParams();
     const pathname = usePathname();
     const { replace } = useRouter();
     useEffect(() => {
          const params = new URLSearchParams(searchParams);
          if (!params.has("callbackUrl")) {
               params.set('callbackUrl', window.location.href.replace("/login", defaultLoginRedirect));
               replace(`${pathname}?${params.toString()}`);
          }
     }, []);

     const { pending } = useFormStatus();
     return (
          <main className="container-fluid mt-5">
               <div className="row justify-content-center">
                    <form action={dispatch} className="col-auto border border-secondary rounded shadow">
                         <div className="mb-1 mt-3 mx-2">
                              <label className="form-label" htmlFor="username">Felhasználó név:</label>
                              <input className={clsx("form-control", { "is-invalid": errorMessage })} type="text" name="username" id="username" required />
                         </div>
                         <div className="mb-3 mx-2">
                              <label className="form-label" htmlFor="password">Jelszó:</label>
                              <input className={clsx("form-control", { "is-invalid": errorMessage })} type="password" name="password" id="password" required />
                              {
                                   errorMessage &&
                                   (<div className='invalid-feedback'>
                                        {errorMessage}
                                   </div>)
                              }
                         </div>
                         <div className="mb-3 mx-2">
                              <button className="btn btn-primary w-100" type="submit" aria-disabled={pending}>Belépés</button>
                         </div>
                    </form>
               </div>
          </main>
     );
}

