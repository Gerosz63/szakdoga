import { getUserById } from "@/app/lib/actions";
import FormSkeleton from "@/app/ui/skeletons/userModifyFormSkeleton";
import UserModifyForm from "@/app/ui/user-modify-form";
import { Suspense } from "react";

export default async function Page({params}: {params:{id:string}}) {
     const id = +params.id;
     const userData = await getUserById(id);
     return (
          <div className="container-fluid mt-4">
               <div className="row justify-content-center">
                    <div className="col-lg-5">
                         <Suspense key={id} fallback={<FormSkeleton/>}>
                              <UserModifyForm id={id} userData={userData}/>
                         </Suspense>
                    </div>
               </div>
          </div>
     );
}