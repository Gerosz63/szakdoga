import Link from "next/link";


export default function Submit({ action, inputChange, href }: { action: "MODIFY" | "ADD", inputChange: () => void, href: string }) {
     return (
          <div className="row mt-3 mb-5 justify-content-between">
               <div className="col-auto">
                    <Link className="btn btn-secondary" href={href}>Vissza</Link>
               </div>
               <div className="col"><hr /></div>
               <div className="col-auto">
                    <button name="submitBtn" onClick={(e) => inputChange()} className="btn btn-success" type="submit">{action == "ADD" ? "Hozzáadás" : "Módosítás"}</button>
               </div>
          </div>
     );
}