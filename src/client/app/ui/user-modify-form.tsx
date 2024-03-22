'use client';

import { useFormState } from 'react-dom';
import { DbActionResult, User } from "../lib/definitions";
import Link from "next/link";
import { modifyUser } from "../lib/db";
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';

export default function UserModifyForm({id, userData}: {id:number, userData:DbActionResult<User>}) {

     const initialState = { message: null, errors: {} };
     const modifyUserDp = modifyUser.bind(null, id);
     const [state, dispatch] = useFormState(modifyUserDp, initialState);
     const [userNameState, setUserNameState] = useState(true);
     const [passwordState, setPasswordState] = useState({visibility:false, validate:true});
     const [roleState, setRoleState] = useState(true);
     const [passwordValue, setPasswordValue] = useState("");

     function inputChange(event:ChangeEvent<HTMLInputElement>) {
          console.log("Név: " + event.target.name);
          switch (event.target.name) {
               case "username":
                    setUserNameState(false);
                    break;
               case "password":
                    setPasswordValue(event.target.value);
                    setPasswordState({visibility: passwordState.visibility, validate:false});
                    break;
               case "role":
                    setRoleState(false);
                    break;
               case "submitBtn": 
                    setUserNameState(true);
                    setPasswordState({visibility: passwordState.visibility, validate:true});;
                    setRoleState(true);
                    break;
               default: 
                    break;
          }
     }

     return (
          <form action={dispatch}>
               <div className="mb-3">
                    <label className="form-label" htmlFor="username">Felhasználónév:</label>
                    <input defaultValue={userData.result?.username} onChange={(e) => inputChange(e)} className={clsx("form-control", {"is-invalid": state.errors?.username && userNameState, "is-valid": userNameState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.username})} type="text" name="username" id="username" required/>
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
                    <input value={passwordValue} onChange={(e) => inputChange(e)} className={clsx("form-control", {"is-invalid": passwordState.validate && state.errors?.password, "is-valid": passwordState.validate && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.password}, {"visually-hidden": !passwordState.visibility})} type="password" name="password" id="password" required/>
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
                              <button onClick={(e) => {setPasswordState({visibility: false, validate:passwordState.validate}); setPasswordValue("");}} type='button' className={clsx('col-auto btn btn-secondary', {"visually-hidden": !passwordState.visibility})}>Mégsem</button>
                              <button onClick={(e) => {setPasswordState({visibility: true, validate:passwordState.validate}); setPasswordValue("");}} type='button' className='col-auto btn btn-secondary' disabled={passwordState.visibility}>Visszaállítás</button>
                         </div>
                    </div>
               </div>
               <div className="mb-3">
                    <label className="form-label" htmlFor="role">Jogosultság kör:</label>
                    <select defaultValue={userData.result?.role} onChange={(e) => inputChange(e)} className={clsx("form-control", {"is-invalid": roleState && state.errors?.role, "is-valid": roleState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.role})} name="role" id="role">
                         <option value="admin">Admin</option>
                         <option value="user">Felhasználó</option>
                    </select>
                    {
                         (state.errors?.role && roleState) &&
                         <div className='invalid-feedback'>
                              {
                                   state.errors.role.map((error: string) => (
                                        <p key={error}>
                                             {error}
                                        </p>
                                   ))
                              }
                         </div>
                    }
               </div>
               <div className="d-flex justify-content-between">
                    <Link className="btn btn-secondary" href="/home/usermanager">Vissza</Link>
                    <button name="submitBtn" onClick={(e) => inputChange(e)} className="btn btn-warning" type="submit">Mentés</button>
               </div>
          </form>
     );
}