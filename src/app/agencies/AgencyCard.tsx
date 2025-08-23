import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Agency } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

export default function AgencyCard({ agency }: { agency: Agency }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-center pb-4">
        {/*<div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          {agency.logoUrl ? (
            <img
              src={agency.logoUrl}
              alt={`${agency.name} logo`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <span className="text-white font-bold text-xl">
              {agency.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
          )}
        </div>*/}
        <CardTitle className="text-xl">{agency.name}</CardTitle>
        {agency.specialization && <Badge variant="secondary">{agency.specialization}</Badge>}
      </CardHeader>

      <CardContent className="pt-0">
        {agency.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{agency.description}</p>}

        {/* Contact Information */}
                  <div className="space-y-2 mb-6 text-sm">
                    {agency.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <a 
                          href={`tel:${agency.phone}`}
                          className="hover:text-primary"
                          data-testid={`link-phone-${agency.id}`}
                        >
                          {agency.phone}
                        </a>
                      </div>
                    )}
                    
                    {agency.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <a 
                          href={`mailto:${agency.email}`}
                          className="hover:text-primary truncate"
                          data-testid={`link-email-${agency.id}`}
                        >
                          {agency.email}
                        </a>
                      </div>
                    )}
                    
                    {agency.address && (
                      <div className="flex items-start text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-xs" data-testid={`text-address-${agency.id}`}>
                          {agency.address}
                        </span>
                      </div>
                    )}
                    
                    {agency.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <a 
                          href={agency.website.startsWith('http') ? agency.website : `https://${agency.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary text-xs truncate text-blue-600 underline"
                          data-testid={`link-website-${agency.id}`}
                        >
                          {agency.website}
                        </a>
                      </div>
                    )}
                  </div>
      </CardContent>
    </Card>
  );
}
