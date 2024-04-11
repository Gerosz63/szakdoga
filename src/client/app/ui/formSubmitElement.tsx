import clsx from "clsx";
import Link from "next/link";


export default function Submit({ action, inputChange, href }: { action: "MODIFY" | "ADD", inputChange: () => void, href: string }) {
     return (
          <div className="row mt-3 justify-content-between">
               <div className="col-auto">
                    <Link className="btn btn-secondary" href={href}>Vissza</Link>
               </div>
               <div className="col"><hr /></div>
               <div className="col-auto">
                    <button name="submitBtn" onClick={(e) => inputChange()} className={clsx("btn", { "btn-warning": action == "MODIFY" }, { "btn-success": action == "ADD" })} type="submit">{action == "ADD" ? "Hozzáadás" : "Módosítás"}</button>
               </div>
          </div>
     );
}