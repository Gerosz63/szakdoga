'use client';

import { useFormState } from 'react-dom';
import { DbActionResult, User, UserState } from "@/app/lib/definitions";
import Link from "next/link";
import { modifyUser } from "@/app/lib/actions";
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Form({ id, userData }: { id: number, userData: DbActionResult<User> | DbActionResult<null> }) {

     const session = useSession();
     const initialState: UserState = { message: null, errors: {} };
     const modifyUserDp = modifyUser.bind(null, id);
     const [state, dispatch] = useFormState(modifyUserDp, initialState);
     const [userNameState, setUserNameState] = useState(true);
     const [passwordState, setPasswordState] = useState({ visibility: false, validate: true });
     const [roleState, setRoleState] = useState(true);
     const [passwordValue, setPasswordValue] = useState("");

     function inputChange(name:string, value?:string) {
          
          switch (name) {
               case "username":
                    setUserNameState(false);
                    break;
               case "password":
                    setPasswordValue(value!);
                    setPasswordState({ visibility: passwordState.visibility, validate: false });
                    break;
               case "role":
                    setRoleState(false);
                    break;
               case "submitBtn":
                    setUserNameState(true);
                    setPasswordState({ visibility: passwordState.visibility, validate: true });;
                    setRoleState(true);
                    state.errors = {};
                    break;
               default:
                    break;
          }
     }

     return (
          <form action={dispatch}>
               <div className="mb-3">
                    <label className="form-label" htmlFor="username">Felhasználónév:</label>
                    <input defaultValue={userData.result?.username} onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": state.errors?.username && userNameState, "is-valid": userNameState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.username })} type="text" name="username" id="username" required />
                    {
                         (state.errors?.username && userNameState) &&
                         <div className='invalid-feedback'>
                              {
                                   state.errors.username.map((error: string) => (
                                        <p key={error}>
                                             {error}
                                        </p>
                                   ))
                              }
                         </div>
                    }
               </div>

               <div className="mb-3">
                    <label className="form-label" htmlFor="password">Jelszó:</label>
                    <input value={passwordValue} onChange={(e) => inputChange(e.target.name, e.target.value)} className={clsx("form-control", { "is-invalid": passwordState.validate && state.errors?.password, "is-valid": passwordState.validate && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.password }, { "visually-hidden": !passwordState.visibility })} type="password" name="password" id="password" />
                    {
                         (state.errors?.password && passwordState.validate) &&
                         <div className='invalid-feedback'>
                              {
                                   state.errors.password.map((error: string) => (
                                        <p key={error}>
                                             {error}
                                        </p>
                                   ))
                              }
                         </div>
                    }
                    <div className="container-fluid mt-2">
                         <div className="row justify-content-between">
                              <button onClick={(e) => { setPasswordState({ visibility: false, validate: passwordState.validate }); setPasswordValue(""); }} type='button' className={clsx('col-auto btn btn-secondary', { "visually-hidden": !passwordState.visibility })}>Mégsem</button>
                              <button onClick={(e) => { setPasswordState({ visibility: true, validate: passwordState.validate }); setPasswordValue(""); }} type='button' className='col-auto btn btn-secondary' disabled={passwordState.visibility}>Visszaállítás</button>
                         </div>
                    </div>
               </div>
               {
                    session.data?.user.role == "admin" &&
                    <div className="mb-3">
                         <label className="form-label" htmlFor="role">Jogosultság kör:</label>
                         <select defaultValue={userData.result?.role} onChange={(e) => inputChange(e.target.name)} className={clsx("form-control", { "is-invalid": roleState && state.errors?.role, "is-valid": roleState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.role })} name="role" id="role">
                              <option value="admin">Admin</option>
                              <option value="user">Felhasználó</option>
                         </select>
                         {
                              (state.errors!.role && roleState) &&
                              <div className='invalid-feedback'>
                                   {
                                        state.errors!.role.map((error: string) => (
                                             <p key={error}>
                                                  {error}
                                             </p>
                                        ))
                                   }
                              </div>
                         }
                    </div>
               }
               <div className="row">
                    <Link className="btn btn-secondary col-auto" href="/usermanager">Vissza</Link>
                    <div className="col"><hr /></div>
                    <button name="submitBtn" onClick={(e) => inputChange(e.currentTarget.name)} className="btn btn-success col-auto" type="submit">Mentés</button>
               </div>
               {
                    state.errors!.general &&
                    <div className="bottom-0 position-fixed w-100 row px-2" tabIndex={-2}>
                              {
                                   state.errors!.general.map((error: string) => (
                                        <div role='alert' className="alert alert-danger mt-4" key={error}>
                                             {error}
                                        </div>
                                   ))
                              }
                    </div>
               }
          </form>
     );
}