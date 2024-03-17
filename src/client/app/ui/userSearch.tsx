import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


export default function UserSearch() {

     const searchParams = useSearchParams();
     const pathname = usePathname();
     const { replace } = useRouter();

     function handleSearch(value:string) {
          const params = new URLSearchParams(searchParams);
          if (value) {
               params.set('query', value);
          } else {
               params.delete('query');
          }
          replace(`${pathname}?${params.toString()}`);
     }

     return (
          <div className="input-group">
               <input defaultValue={searchParams.get('query')?.toString()} onChange={(e) => handleSearch(e.target.value)} type="text" className="form-control" placeholder="Keress felhasználó névre..." />
               <Link href="/home/usermanager/create" className="btn btn-outline-success"><FontAwesomeIcon icon={faPlus} /></Link>
          </div>
     );
}