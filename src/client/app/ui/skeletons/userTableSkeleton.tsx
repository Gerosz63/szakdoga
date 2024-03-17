export default function UserTableSkeleton() {
     return (
          <table className="table">
               <thead>
                    <th>Felhasználónév</th>
                    <th>Szerpkör</th>
                    <th>Téma</th>
                    <th></th>
               </thead>
               <tbody>
                    <tr>
                         <td><span className="placeholder w-75"></span></td>
                         <td><span className="placeholder w-50"></span></td>
                         <td><span className="placeholder w-25"></span></td>
                         <td>
                              <a className="btn btn-warning disabled placeholder col-4" aria-disabled="true"></a>
                              <a className="btn btn-danger disabled placeholder col-4" aria-disabled="true"></a>
                         </td>
                    </tr>
                    <tr>
                         <td><span className="placeholder w-75"></span></td>
                         <td><span className="placeholder w-50"></span></td>
                         <td><span className="placeholder w-25"></span></td>
                         <td>
                              <a className="btn btn-warning disabled placeholder col-4" aria-disabled="true"></a>
                              <a className="btn btn-danger disabled placeholder col-4" aria-disabled="true"></a>
                         </td>
                    </tr>
                    <tr>
                         <td><span className="placeholder w-50"></span></td>
                         <td><span className="placeholder w-50"></span></td>
                         <td><span className="placeholder w-25"></span></td>
                         <td>
                              <a className="btn btn-warning disabled placeholder col-4" aria-disabled="true"></a>
                              <a className="btn btn-danger disabled placeholder col-4" aria-disabled="true"></a>
                         </td>
                    </tr>
                    <tr>
                         <td><span className="placeholder w-50"></span></td>
                         <td><span className="placeholder w-50"></span></td>
                         <td><span className="placeholder w-25"></span></td>
                         <td>
                              <a className="btn btn-warning disabled placeholder col-4" aria-disabled="true"></a>
                              <a className="btn btn-danger disabled placeholder col-4" aria-disabled="true"></a>
                         </td>
                    </tr>
                    <tr>
                         <td><span className="placeholder w-100"></span></td>
                         <td><span className="placeholder w-50"></span></td>
                         <td><span className="placeholder w-25"></span></td>
                         <td>
                              <a className="btn btn-warning disabled placeholder col-4" aria-disabled="true"></a>
                              <a className="btn btn-danger disabled placeholder col-4" aria-disabled="true"></a>
                         </td>
                    </tr>
               </tbody>
          </table>
     );
}