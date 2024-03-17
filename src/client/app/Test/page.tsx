'use client';

import { useState } from 'react';
import {listUsers} from '../lib/db'

export default function Page() {
     const [state, setText] = useState("");

     async function test1() {
          const u = await listUsers("t");
          setText(u.toString());
     }

     return (
          <div className="container-fluid mt-5">
               <div className="row justify-content-center">
                    <form className="col-auto" action={test1}>
                         <button className="btn btn-outline-secondary" type="submit">Db search</button>
                    </form>
               </div>
               <div className="row justify-content-center">
                    <div className="col-auto">
                         <p id="res">{state}</p>
                    </div>
               </div>
          </div>
     );
}