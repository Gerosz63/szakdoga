
import { Suspense } from "react";
import UserTableSkeleton from "@/app/ui/skeletons/userTableSkeleton";
import Table from "@/app/ui/userTable";
import Search from "@/app/ui/userSearch";
import { listUsers } from "@/app/lib/actions";
import { DbActionResult, User } from "@/app/lib/definitions";



export default async function Page({
     searchParams,
}: {
     searchParams?: {
          query?: string;
          page?: string;
     };
}) {
     const query = searchParams?.query || '';
     const currentPage = Number(searchParams?.page) || 1;
     const users = await listUsers(query, currentPage);
     return (
          <div className="container-fluid mt-5">
               <div className="row justify-content-center">
                    <div className="col-md-7">
                         <Search />
                    </div>
               </div>
               <hr />
               <div className="row justify-content-center">
                    <div className="col-md-7">
                         <Suspense key={query + currentPage} fallback={<UserTableSkeleton />}>
                              <Table users={users} />
                         </Suspense>
                    </div>
               </div>
          </div>
     );
}
