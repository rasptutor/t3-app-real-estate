"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navigation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/properties", label: "Buy", listingType: "sale" },
    { path: "/properties", label: "Rent", listingType: "rent" },
    { path: "/agencies", label: "Agencies" },
    { path: "/calculator", label: "Calculator" },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className={`flex ${mobile ? "flex-col space-y-4" : "items-baseline space-x-4"}`}>
      {navItems.map((item) => {
        //const isActive = pathname === item.path || pathname.startsWith(item.path.split("?")[0] as string);
        let isActive = false;

        if (item.listingType) {
          const currentType = searchParams.get("listingType");
          isActive = pathname === item.path && currentType === item.listingType;
        } else {
          isActive = pathname === item.path || pathname.startsWith(item.path);
        }
        return (
          <Link
            key={item.listingType ? `${item.path}-${item.listingType}` : item.path}
            href={item.listingType ? `${item.path}?listingType=${item.listingType}` : item.path}
            onClick={() => mobile && setIsOpen(false)}
            className={`transition-colors ${
              isActive
                ? "text-primary font-semibold border-b-2 border-primary"
                : "text-gray-700 hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              PropertyHub
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <NavLinks />
            </div>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            {session ? (
              <Button onClick={() => signOut()} variant="outline">
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => signIn()} className="btn-primary">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link href="/" className="text-xl font-bold text-primary">
                    PropertyHub
                  </Link>
                  <NavLinks mobile />
                  {session ? (
                    <Button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      variant="outline"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        signIn();
                        setIsOpen(false);
                      }}
                      className="btn-primary w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;


