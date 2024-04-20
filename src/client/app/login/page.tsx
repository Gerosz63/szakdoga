"use client";
import { useFormState, useFormStatus } from 'react-dom';
import clsx from 'clsx';
import { login } from '@/app/lib/actions';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams} from 'next/navigation';
import { defaultLoginRedirect } from '../lib/definitions';
import Image from 'next/image'
import mainpic from '@/public/theme_pic.jpg';

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
          <main className="container-fluid mybg-greenblue">
               <div className="row justify-content-center vh-100 align-items-center mx-5">
                    <form action={dispatch} className="col-xl-3 col-lg-4 col-md-5 border border-secondary rounded shadow mybg-grey">
                         <div className="mb-1 mt-3 mx-2 fs-1 text-center">
                              <Image
                                   alt='Arculat kép.'
                                   src={mainpic}
                                   width={100}
                                   height={100}
                                   className='rounded-2'
                              />
                              <span className='ms-3 fw-bold'>Bejelentkezés</span>
                         </div>
                         <hr />
                         <div className="mb-1 mt-3 mx-2">
                              <label className="form-label required fw-bold" htmlFor="username">Felhasználó név:</label>
                              <input className={clsx("form-control", { "is-invalid": errorMessage })} type="text" name="username" id="username" required />
                         </div>
                         <div className="mb-3 mx-2">
                              <label className="form-label required fw-bold" htmlFor="password">Jelszó:</label>
                              <input className={clsx("form-control", { "is-invalid": errorMessage })} type="password" name="password" id="password" required />
                              {
                                   errorMessage &&
                                   (<div className='invalid-feedback'>
                                        {errorMessage}
                                   </div>)
                              }
                         </div>
                         <div className="mb-3 mx-2">
                              <button className="btn btn-primary btn-lg w-100" type="submit" aria-disabled={pending}>Belépés</button>
                         </div>
                    </form>
               </div>
          </main>
     );
}

