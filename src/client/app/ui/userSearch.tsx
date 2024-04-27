'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


export function SearchUser() {

     const searchParams = useSearchParams();
     const pathname = usePathname();
     const { replace } = useRouter();

     const handleSearch = useDebouncedCallback((value: string) => {
          const params = new URLSearchParams(searchParams);
          if (value) {
               params.set('query', value);
          } else {
               params.delete('query');
          }
          replace(`${pathname}?${params.toString()}`);
     }, 300);

     return (
          <div className="input-group">
               <input defaultValue={searchParams.get('query')?.toString()} onChange={(e) => handleSearch(e.target.value)} type="text" className="form-control" placeholder="Keress felhasználó névre..." />
               <Link href="/usermanager/create" className="btn btn-success"><FontAwesomeIcon icon={faPlus} /></Link>
          </div>
     );
}
export function Searchresult() {
     const searchParams = useSearchParams();
     const pathname = usePathname();
     const { replace } = useRouter();

     const handleSearch = useDebouncedCallback((value: string) => {
          const params = new URLSearchParams(searchParams);
          if (value) {
               params.set('query', value);
          } else {
               params.delete('query');
          }
          replace(`${pathname}?${params.toString()}`);
     }, 300);

     return (
          <div className="input-group">
               <input defaultValue={searchParams.get('query')?.toString()} onChange={(e) => handleSearch(e.target.value)} type="text" className="form-control" placeholder="Keress eredményre..." />
          </div>
     );
}