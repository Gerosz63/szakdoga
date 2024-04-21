"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";



export default function Pagination({ maxpage }: { maxpage: number }) {

     const searchParams = useSearchParams();
     const pathname = usePathname();
     const { replace } = useRouter();

     const current_page = Number.isNaN(+(searchParams.get("page") ?? 1)) ? 1 : +(searchParams.get("page") ?? 1);
     const pagenumbers: number[] = [];
     if (maxpage < 4) {
          if (maxpage < 4)
               pagenumbers.push(1);
          if (1 < maxpage && maxpage < 4)
               pagenumbers.push(2);
          if (maxpage == 3)
               pagenumbers.push(3);
     } else {
          if (maxpage == current_page) {
               pagenumbers.push(current_page - 2);
               pagenumbers.push(current_page - 1);
               pagenumbers.push(current_page);
          }
          else if (current_page == 1) {
               pagenumbers.push(current_page);
               pagenumbers.push(current_page + 1);
               pagenumbers.push(current_page + 2);
          }
          else {
               pagenumbers.push(current_page - 1);
               pagenumbers.push(current_page);
               pagenumbers.push(current_page + 1);
          }
     }
     function changePage(pagenbr: number) {
          console.log(pagenbr);
          
          const params = new URLSearchParams(searchParams);
          params.set('page', pagenbr.toString());
          replace(`${pathname}?${params.toString()}`);
     }

     return (
          <nav aria-label="Page navigation mybg-green">
               <ul className="pagination justify-content-end">
                    <li className="page-item"><button onClick={(e) => changePage(current_page - 1)} className={clsx("page-link", { "disabled": current_page == 1 })}>Elöző</button></li>
                    <li className="page-item"><button onClick={(e) => changePage(pagenumbers[0])} className={clsx("page-link", { "active": pagenumbers[0] == current_page })}>{pagenumbers[0]}</button></li>
                    {
                         pagenumbers.length > 1 &&
                         <li className="page-item"><button onClick={(e) => changePage(pagenumbers[1])} className={clsx("page-link", { "active": pagenumbers[1] == current_page })}>{pagenumbers[1]}</button></li>
                    }
                    {
                         pagenumbers.length > 2 &&
                         <li className="page-item"><button onClick={(e) => changePage(pagenumbers[2])} className={clsx("page-link", { "active": pagenumbers[2] == current_page })}>{pagenumbers[2]}</button></li>
                    }
                    <li className="page-item"><button onClick={(e) => changePage(current_page + 1)} className={clsx("page-link", { "disabled": current_page == maxpage })}>Következő</button></li>
               </ul>
          </nav>
     );
}