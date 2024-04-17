import { getUserById } from "@/app/lib/actions";
import FormSkeleton from "@/app/ui/skeletons/userModifyFormSkeleton";
import Form from "@/app/ui/userModifyForm";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
     const id = +params.id;
     const userData = await getUserById(id);
     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center mb-3">
                    <div className="col">
                         <h1 className="text-center placeholder-glow"><b>{userData.success ? userData.result?.username : <span className="placeholder w-25"></span>}</b> felhasználó módosítása</h1>
                    </div>
               </div>
               {
                    userData.success ?
                         <div className="row justify-content-center">
                              <div className="col-lg-7">
                                   <Suspense key={id} fallback={<FormSkeleton />}>
                                        <Form id={id} userData={userData} />
                                   </Suspense>
                              </div>
                         </div>
                         :
                         <>
                              <FormSkeleton />
                              <div className="bottom-0 position-fixed w-100 row px-2" tabIndex={-2}>
                                   {
                                        <div role='alert' className="alert alert-danger mt-4">
                                             {userData.message!}
                                        </div>
                                   }
                              </div>
                         </>
               }
          </div>
     );
}