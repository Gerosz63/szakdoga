import Link from "next/link";

export default function FormSkeleton() {
     return (
          <>
               <form>
                    <div className="mb-3 placeholder-glow">
                         <label className="form-label" htmlFor="username">Felhasználónév:</label>
                         <span className="placeholder w-75 form-control"></span>
                    </div>
                    
                    <div className="mb-3 placeholder-glow">
                         <label className="form-label" htmlFor="password">Új jelszó:</label>
                         <span className="placeholder w-50 form-control"></span>
                    </div>
                    <div className="mb-3 placeholder-glow">
                         <label className="form-label" htmlFor="role">Jogosultság kör:</label>
                         <span className="placeholder w-25 form-control"></span>
                    </div>
                    <div className="row">
                         <Link className="btn btn-secondary col-auto" href="/usermanager">Vissza</Link>
                         <div className="col"><hr /></div>
                         <button name="submitBtn" className="btn btn-warning col-auto" type="submit">Mentés</button>
                    </div>
               </form>
          </>
     );
}