'use client';

import { useFormState } from 'react-dom';
import { User } from "../lib/definitions";
import Link from "next/link";
import { addUser } from "../lib/db";
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';


export default function UserCreateForm() {
     const initialState = { message: null, errors: {} };

     const [state, dispatch] = useFormState(addUser, initialState);
     const [userNameState, setUserNameState] = useState(true);
     const [passwordState, setPasswordState] = useState(true);
     const [passwordRepState, setPasswordRepState] = useState(true);
     const [roleState, setRoleState] = useState(true);

     function inputChange(event:ChangeEvent<HTMLInputElement>) {
          console.log("Név: " + event.target.name);
          switch (event.target.name) {
               case "username":
                    setUserNameState(false);
                    break;
               case "password":
                    setPasswordState(false);
                    break;
               case "password_rep":
                    setPasswordRepState(false);
                    break;
               case "role":
                    setRoleState(false);
                    break;
               case "submitBtn": 
                    setUserNameState(true);
                    setPasswordState(true);
                    setPasswordRepState(true);
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
                    <input onChange={(e) => inputChange(e)} className={clsx("form-control", {"is-invalid": state.errors?.username && userNameState, "is-valid": userNameState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.username})} type="text" name="username" id="username" required/>
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
                    <input onChange={(e) => inputChange(e)} className={clsx("form-control", {"is-invalid": passwordState && state.errors?.password, "is-valid": passwordState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.password})} type="password" name="password" id="password" required/>
                    {
                         (state.errors?.password && passwordState) &&
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
               </div>
               <div className="mb-3">
                    <label className="form-label" htmlFor="password_rep">Jelszó újra:</label>
                    <input onChange={(e) => inputChange(e)} className={clsx("form-control", {"is-invalid": passwordRepState && state.errors?.password_rep, "is-valid": passwordRepState && Object.values(state.errors ?? {}).length !== 0 && !state.errors?.password_rep})} type="password" name="password_rep" id="password_rep" />
                    {
                         (state.errors?.password_rep && passwordRepState) &&
                         <div className='invalid-feedback'>
                              {
                                   state.errors.password_rep.map((error: string) => (
                                        <p key={error}>
                                             {error}
                                        </p>
                                   ))
                              }
                         </div>
                    }
               </div>
               <div className="mb-3">
                    <label className="form-label" htmlFor="role">Jogosultság kör:</label>
                    <select onChange={(e) => inputChange(e)} className={clsx("form-control", {"is-invalid": roleState && state.errors?.role, "is-valid": roleState && Object.keys(state.errors ?? {}).length !== 0 && !state.errors?.role})} name="role" id="role">
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
                    <button name="submitBtn" onClick={(e) => inputChange(e)} className="btn btn-success" type="submit">Létrehozás</button>
               </div>
          </form>
     );
}