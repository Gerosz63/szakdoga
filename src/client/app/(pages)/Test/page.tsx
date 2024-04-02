'use client';
export default function Page() {

     return (

          <>
               <div className="col-md">
                    <label className="form-label" htmlFor="gmax">Maximális termelés:</label>
                    <input className="form-control is-invalid" id="gmax" required type="text" value="" name="gmax"/>
               </div>
          </>
     );
}