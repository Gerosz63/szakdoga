import { getUserById } from "@/app/lib/actions";
import FormSkeleton from "@/app/ui/skeletons/userModifyFormSkeleton";
import Form from "@/app/ui/userModifyForm";
import { Suspense } from "react";

export default async function Page({params}: {params:{id:string}}) {
     const id = +params.id;
     const userData = await getUserById(id);
     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center">
                    <div className="col-lg-5">
                         <Suspense key={id} fallback={<FormSkeleton/>}>
                              <Form id={id} userData={userData}/>
                         </Suspense>
                    </div>
               </div>
          </div>
     );
}