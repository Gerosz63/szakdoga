'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-regular-svg-icons';

export default function Navbar() {
     const linkPath = usePathname();
     const links = [
          {
               name: "result",
               path: "/home/results",
               text: "Eredmények"
          },
          {
               name: "simulator",
               path: "/home/simulate",
               text: "Szimulátor"
          },
          {
               name: "usermanager",
               path: "/home/usermanager",
               text: "Felhasználók"
          }
     ];
     return (
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
               <div className="container-fluid">
                    <Link className="navbar-brand" href='/home'>Home</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                         <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                         <div className="navbar-nav">
                              {links.map((e) => {
                                   return (<Link key={e.name} className={clsx("nav-link", {"active": linkPath.startsWith(e.path)} )} href={e.path}>{e.text}</Link>);
                              })}
                         </div>
                         <div className="w-100 d-flex justify-content-end">
                              <button type="button" className="btn btn-outline-secondary border rounded-3">
                                   <FontAwesomeIcon className="m-1" icon={faUser} />
                              </button>
                         </div>
                    </div>
               </div>
          </nav>
     );
}