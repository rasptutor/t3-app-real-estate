import { api } from "@/trpc/server";
import Agencies from "./Agencies";

export default async function AgenciesPage() {
  
  const agencies = await api.agency.getAll();  
  

  return (
    <main className="p-8">      
        <Agencies agencies={agencies} isLoading={false} error={null} uniqueSpecializations={[]}/>
    </main>
  );
}


