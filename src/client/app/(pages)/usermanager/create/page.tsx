import Form from "@/app/ui/userCreateForm";


export default function Page() {
     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center mb-3">
                    <div className="col">
                         <h1 className="text-center">Új felhasználó létrehozása</h1>
                    </div>
               </div>
               <div className="row justify-content-center">
                    <div className="col-lg-5">
                         <Form />
                    </div>
               </div>
          </div> 
     );
}