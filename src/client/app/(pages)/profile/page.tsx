import { getUserById } from "@/app/lib/actions";
import FormSkeleton from "@/app/ui/skeletons/userModifyFormSkeleton";
import Form from "@/app/ui/userModifyForm";
import { auth } from "@/auth";
import { Suspense } from "react";


export default async function Page() {
     const session = await auth();
     const user = await getUserById(+session?.user.id!);


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
                                   <Suspense fallback={<FormSkeleton />}>
                                        <Form id={user.result!.id!} userData={user} />
                                   </Suspense>
                                   :
                                   <>
                                        <FormSkeleton />
                                        <div className="bottom-0 position-fixed w-100 row px-2" tabIndex={-2}>
                                             <div role='alert' className="alert alert-danger mt-4">
                                                  {user.message!}
                                             </div>
                                        </div>
                                   </>
                         }
                    </div>
               </div>
          </div>
     );
}