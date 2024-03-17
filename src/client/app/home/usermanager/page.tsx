'use client';

import { Suspense } from "react";
import UserTableSkeleton from "@/app/ui/skeletons/userTableSkeleton";
import UserTable from "@/app/ui/userTable";
import UserSearch from "@/app/ui/userSearch";


export default function Page() {
     

     return (
          <div className="container-fluid mt-5">
               <div className="row justify-content-center">
                    <div className="col-md-7">
                         <UserSearch/>
                    </div>
               </div>
               <hr />
               <Suspense fallback={<UserTableSkeleton/>}>
                    <UserTable query={searchParams.get('query')?.toString()} page={}/>
               </Suspense>
          </div>
     );
}