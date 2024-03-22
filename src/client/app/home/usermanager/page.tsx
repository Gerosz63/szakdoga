'use client';
import { Suspense } from "react";
import UserTableSkeleton from "@/app/ui/skeletons/userTableSkeleton";
import UserTable from "@/app/ui/userTable";
import UserSearch from "@/app/ui/userSearch";



export default function Page({
     searchParams,
}: {
     searchParams?: {
          query?: string;
          page?: string;
     };
}) {
     const query = searchParams?.query || '';
     const currentPage = Number(searchParams?.page) || 1;

     return (
          <div className="container-fluid mt-5">
               <div className="row justify-content-center">
                    <div className="col-md-7">
                         <UserSearch />
                    </div>
               </div>
               <hr />
               <div className="row justify-content-center">
                    <div className="col-md-7">
                         <Suspense key={query + currentPage} fallback={<UserTableSkeleton />}>
                              <UserTable query={query} page={currentPage} />
                         </Suspense>
                    </div>
               </div>
          </div>
     );
}
