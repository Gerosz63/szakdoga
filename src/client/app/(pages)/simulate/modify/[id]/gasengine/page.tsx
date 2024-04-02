import { getGeneratorById } from "@/app/lib/actions";
import { GasEngine } from "@/app/lib/definitions";
import Form from "@/app/ui/gasEngineForm";

export default async function Page({ params }: { params: { id: string } }) {

     const user = await getGeneratorById("GAS", +params.id); 
     const ga = user.result![0] as GasEngine;

     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center">
                    <div className="col-auto">
                         <h2>{ga.name} nevű gázmotor módosítása</h2>
                    </div>
               </div>
               <div className="row justify-content-center"> 
                    <div className="col-md-9">
                         <Form action="MODIFY" gasEngine={ga}/>
                    </div>
               </div >
          </div >
     );
}