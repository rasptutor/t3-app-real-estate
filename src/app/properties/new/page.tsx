import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import CreatePropertyForm from "./CreatePropertyForm";
import Link from "next/link";

export default async function NewPropertyPage() {  
    const session = await auth();
    if (!session || session.user.role !== "AGENT") {
        redirect("/properties"); // or a 403 page
    }    
  
  return (
    <>
      <CreatePropertyForm />
      <Link
        href="/properties"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Back to Listings
      </Link>
    </>
  );
}
