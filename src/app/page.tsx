import Link from "next/link";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ListingType from "@/components/ListingType";
import FeaturedProperties from "@/components/FeaturedProperties";
import FeaturedAgencies from "@/components/FeaturedAgencies";
import QuickTools from "@/components/QuickTools";
import Footer from "@/components/Footer";

export default async function Home() {  
  const session = await auth();  
  
  if (session?.user.role === 'USER') {
    redirect('/properties')
  }
  
  if (session?.user.role === 'AGENT') {
    redirect('/properties/new')
  }

  if (session?.user.role === 'ADMIN') {
    redirect('/admin')
  }
  
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">

          <section className="relative h-48 hero-gradient mb-15" data-testid="hero-section">
            <div className="overlay"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="text-center w-full">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow" data-testid="text-hero-title">
                  Find Your Dream Property
                </h1>
                <p className="text-xl text-gray-200 mb-8" data-testid="text-hero-subtitle">
                  Discover the perfect home or investment opportunity
                </p>
              </div>
            </div>            
            <SearchBar/>
          </section>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] mt-10">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>          
          <div className="flex flex-col items-center gap-2">            

            <div className="flex flex-col items-center justify-center gap-4">             
              
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
          <ListingType/>
          <FeaturedProperties/> 
          <FeaturedAgencies/>
          <QuickTools/>
          <Footer/>      
        </div>
      </main>
    </HydrateClient>
  );
}
