
export default function Page() {
     return <main className="container-fluid mt-5">
          <div className="row justify-content-center">
               <form action="" className="col-auto border border-secondary rounded shadow">
                    <div className="mb-1 mt-3 mx-2">
                         <label className="form-label" htmlFor="username">Felhasználó név:</label>
                         <input className="form-control" type="text" name="username" id="username" />
                    </div>
                    <div className="mb-3 mx-2">
                         <label className="form-label" htmlFor="password">Jelszó:</label>
                         <input className="form-control" type="password" name="password" id="password" />
                    </div>
                    <div className="mx-3">
                         
                    </div>
                    <div className="mb-3 mx-2">
                         <button className="btn btn-primary w-100" type="submit">Belépés</button>
                    </div>
               </form>
          </div>
     </main>;
}