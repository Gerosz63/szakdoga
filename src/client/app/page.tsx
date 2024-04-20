import Link from "next/link";
import Image from 'next/image'
import mainpic from '@/public/theme_pic.jpg';
import { Jura } from "next/font/google";
import clsx from "clsx";
const jura = Jura({ subsets: ["latin-ext"], weight: ["300"] });

export default function Page() {
     return (
          <div className="container-fluid vh-100 align-content-center mybg-greenblue">
               <div className="row justify-content-center">
                    <div className="col-11 col-md-5 col-xl-3 border rounded py-3 shadow mybg-grey">
                         <div className="row py-2 bg-secondary align-items-center">
                              <div className="col-auto">
                                   <Image
                                        alt='Arculat kép.'
                                        src={mainpic}
                                        width={100}
                                        height={100}
                                        className='rounded-2 align-middle shadow'
                                   />
                              </div>
                              <div className="col">
                                   <h1 className={clsx("text-center text-white fw-bold align-middle text-shadow", jura.className)}>
                                        OPTIMIZER
                                   </h1>
                              </div>
                         </div>

                         <div className="row border-top border-bottom justify-content-center m-0 w-100">
                              <div className="col-auto rounded-4">
                                   <h2>
                                        Lépj be egy optimálisabb világba!
                                   </h2>
                              </div>
                         </div>

                         <div className="row pt-3">
                              <div className="col">
                                   <Link className="btn btn-primary w-100 fs-4" href="/login">Belépek!</Link>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}