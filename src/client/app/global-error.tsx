'use client'

import Link from "next/link"

export default function GlobalError({
     error,
     reset,
}: {
     error: Error & { digest?: string }
     reset: () => void
}) {
     return (
          <html>
               <body>
                    <div className='mybg-greenblue vh-100 row align-items-center justify-content-center'>
                         <div className='col-6'>
                              <h2>Valami hiba történt!</h2>
                              <button className="btn btn-secondary" onClick={() => reset()}>Próbáld újra!</button>
                              <Link className='text-dark' href="/simulate">Vissza a  szimulátor oldalára</Link>
                         </div>
                    </div>
               </body>
          </html>
     )
}