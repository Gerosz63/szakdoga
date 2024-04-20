import Element from "@/app/ui/readonlyGeneratorElement";
import { EnergyStorage, GasEngine, SolarPanel } from "@/app/lib/definitions";

export default function List({ title, type, elements }: { title: string, type: "GAS" | "SOLAR" | "STORE", elements: (SolarPanel | GasEngine | EnergyStorage)[] }) {


     return (
          <div className="border rounded-4 shadow px-2 py-3 mb-2 ps-3 bg-light">
               <h3>{title}</h3>
               <hr />
               <div className="container-fluid">
                    {
                         elements.map((e) =>
                              <Element key={e.id} generator={e} type={type} />
                         )
                    }
               </div>
          </div>
     );
}