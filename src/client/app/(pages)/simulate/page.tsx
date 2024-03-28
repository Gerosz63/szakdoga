import { auth } from "@/auth";

export default async function Page() {
     const session = await auth();
     return (
          <div>
               <h1>Simulatorrr!</h1>
               <div>{JSON.stringify(session)}</div>
          </div>
     );
}