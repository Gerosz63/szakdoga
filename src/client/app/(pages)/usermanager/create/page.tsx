import UserCreateForm from "@/app/ui/user-create-form";


export default function Page() {
     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center">
                    <div className="col-lg-5">
                         <UserCreateForm />
                    </div>
               </div>
          </div> 
     );
}