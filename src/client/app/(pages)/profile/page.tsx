import { getUserById } from "@/app/lib/actions";
import Form from "@/app/ui/userModifyForm";
import { auth } from "@/auth";


export default async function Page() {
     const session = await auth();
     const user =  await getUserById(+session?.user.id!);


     return (
          <div className="container-fluid">
               <div className="row">
                    <div className="col text-center">
                         <h1>Profilom</h1>
                    </div>
               </div>
               <div className="row justify-content-center">
                    <div className="col-9">
                         {
                              user.success ?
                              <Form id={user.result!.id!} userData={user} />
                              : <div role="alert" className="alert alert-danger">{user.message!}</div>
                         }
                         
                    </div>
               </div>
          </div>
     );
}