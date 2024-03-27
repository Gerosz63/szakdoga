import Link from "next/link";
import Modal from "../deleteModal";

export default function FormSkeleton() {
     return (
          <>
               <form>
                    <div className="mb-3">
                         <label className="form-label" htmlFor="username">Felhasználónév:</label>
                         <span className="placeholder w-75 form-control"></span>
                    </div>
                    
                    <div className="mb-3">
                         <label className="form-label" htmlFor="password">Új jelszó:</label>
                         <span className="placeholder w-50 form-control"></span>
                    </div>
                    <div className="mb-3">
                         <label className="form-label" htmlFor="role">Jogosultság kör:</label>
                         <span className="placeholder w-25 form-control"></span>
                    </div>
                    <div className="d-flex justify-content-between">
                         <Link className="btn btn-secondary" href="/home/usermanager">Vissza</Link>
                         <button name="submitBtn" className="btn btn-warning" type="submit">Mentés</button>
                    </div>
               </form>
          </>
     );
}