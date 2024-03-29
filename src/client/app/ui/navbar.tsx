"user client";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { logout } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
     const user = useSession().data?.user;
     const linkPath = usePathname();
     const links = [
          {
               name: "simulator",
               path: "/simulate",
               text: "Szimulátor"
          },
          {
               name: "result",
               path: "/results",
               text: "Eredmények"
          },

     ];
     if (user?.role === "admin")
          links.push(
               {
                    name: "usermanager",
                    path: "/usermanager",
                    text: "Felhasználók"
               }
          );
     return (
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
               <div className="container-fluid">
                    <Link className="navbar-brand" href='/home'>Home</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                         <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                         <ul className="navbar-nav me-auto mb-2 mb-md-0">
                              {links.map((e) => {
                                   return (
                                        <li key={e.name} className="nav-item ">
                                             <Link className={clsx("nav-link", { "active": linkPath.startsWith(e.path) })} href={e.path}>{e.text}</Link>
                                        </li>
                                   );
                              })}
                         </ul>
                         <div className="d-flex">
                              <div className="dropdown">
                                   <button className="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {user?.name} <FontAwesomeIcon icon={faUser} />
                                   </button>
                                   <ul className="dropdown-menu dropdown-menu-end">
                                        <li></li>
                                        <li><Link className="dropdown-item" href="/profile">Profilom</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                             <form action={async (e) => {
                                                  await logout();
                                             }}>
                                                  <button className="dropdown-item" type="submit"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Kijelentkezés</button>
                                             </form>
                                        </li>
                                   </ul>
                              </div>
                         </div>
                    </div>
               </div>
          </nav>
     );
}