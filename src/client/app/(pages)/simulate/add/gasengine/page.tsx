import Form from "@/app/ui/gasEngineForm";

export default function Page() {
     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center">
                    <div className="col-auto">
                         <h2>Új gázmotor hozzáadása</h2>
                    </div>
               </div>
               <div className="row justify-content-center">
                    <div className="col-md-9">
                         <Form action="ADD"/>
                    </div>
               </div >
          </div >
     );
}