import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='mybg-greenblue vh-100 row align-items-center justify-content-center'>
      <div className='col-6'>
           <h2 className='mytext-grey text-shadow'>A keresett oldal nem található!</h2>
           <Link className='text-dark' href="/simulate">Vissza a  szimulátor oldalára</Link>
      </div>
    </div>
  )
}