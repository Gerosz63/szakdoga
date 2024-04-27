import { getResults, getResultsMaxPage } from "@/app/lib/actions";
import Pagination from "@/app/ui/pagination";
import List from "@/app/ui/resulstList";
import ListSkeleton from "@/app/ui/skeletons/resultListSkeleton";
import { Searchresult } from "@/app/ui/userSearch";
import { auth } from "@/auth";
import { Suspense } from "react";


export default async function Page({
     searchParams,
}: {
     searchParams?: {
          query?: string;
          page?: string;
     };
}) {
     const session = await auth()
     const query = searchParams?.query || '';
     const currentPage = Number(searchParams?.page) || 1;
     const res = await getResults(+session?.user.id!, query, currentPage);
     const max_page = await getResultsMaxPage(+session?.user.id!);

     return (
          <div className="container-fluid">
               <div className="row">
                    <div className="col text-center">
                         <h1>Eredmények</h1>
                    </div>
               </div>
               <div className="row justify-content-center">
                    <div className="col-md-10 my-2">
                         <Searchresult />
                    </div>
               </div>
               <div className="row justify-content-center">
                    <div className="col-md-9">
                         <div className="container-fluid">
                              {
                                   res.success && res.result?.length != 0 ?
                                        <Suspense fallback={<ListSkeleton />}>
                                             <List results={res.result!} />
                                        </Suspense>
                                        :
                                        <div className="row justify-content-center">
                                             <div className="col-auto">
                                                  <h5>Nincs még mentett szimulációd!</h5>
                                             </div>
                                        </div>
                              }
                              {
                                   (!res.success || !max_page.success) &&
                                   <>
                                        <ListSkeleton />
                                        <div className="start-0 bottom-0 position-fixed w-100 row ps-4" tabIndex={-2}>
                                             <div role='alert' className="alert alert-danger mt-4">
                                                  {res.message!}
                                             </div>
                                        </div>
                                   </>
                              }
                         </div>
                    </div>
               </div>
               <div className="row mt-4 mb-5">
                    <Pagination maxpage={max_page.success ? max_page.result! : 1} />
               </div>
          </div>
     );
}