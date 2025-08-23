// src/app/properties/[id]/PropertyDetailsOverview.tsx

'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bath, Bed, Car, MapPin, Flame, Droplets, Phone, Tv, Trash2, Waves, Snowflake, Thermometer, Wifi, Bolt, Square } from "lucide-react";

const ICONS_MAP: Record<string, any> = {
  bed: Bed,
  bath: Bath,
  car: Car,
  sqft: Square,
  mapPin: MapPin,
  gas: Flame,
  water: Droplets,
  phone: Phone,
  cable: Tv,
  trash: Trash2,
  sewage: Waves,
  cooling: Snowflake,
  heating: Thermometer,
  internet: Wifi,
  electricity: Bolt,
  default: Square,
};

function getIcon(name: string) {
  return ICONS_MAP[name] || Square;
}

interface ListingType {
  label: string;
  bgColor: string;
  textColor: string;
}

export interface PropertyDetails {
    title: string;
    location: string;
    price?: number | null;       
    rentPrice?: number | null;
    propertyType: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    sqft?: number | null;
    parking?: number | null;
    description?: string | null;
    features?: string[] | null;
    listingType: ListingType;
    utilities?: { key: string; label: string; status: string; statusColor: string; icon: any }[] | null;
}

interface PropertyDetailsOverviewProps {
  property: PropertyDetails;
}

export default function PropertyDetailsOverview({ property }: PropertyDetailsOverviewProps) {
  const formatAddress = (p: typeof property) => p.location; // simple placeholder
  const getUtilityDisplay = () => property.utilities || [];

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold mb-2" data-testid="text-property-title">
                {property.title}
              </CardTitle>
              <p className="text-gray-600 flex items-center mb-4" data-testid="text-property-address">
                <MapPin className="w-4 h-4 mr-1" />
                {formatAddress(property)}
              </p>
            </div>
            <Badge className={`${property.listingType.bgColor} ${property.listingType.textColor}`}>
              {property.listingType.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-property-price">
                {property.listingType.label === "For Rent"
                ? `$${property.rentPrice?.toLocaleString()} / mo`
                : `$${property.price?.toLocaleString()}`}
              </div>
              <div className="text-gray-600">{property.propertyType}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {property.bedrooms && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bed className="w-5 h-5 text-gray-400 mr-1" />
                    <span className="text-xl font-semibold" data-testid="text-bedrooms">
                      {property.bedrooms}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
              )}

              {property.bathrooms && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bath className="w-5 h-5 text-gray-400 mr-1" />
                    <span className="text-xl font-semibold" data-testid="text-bathrooms">
                      {property.bathrooms}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
              )}

              {property.sqft && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Square className="w-5 h-5 text-gray-400 mr-1" />
                    <span className="text-xl font-semibold" data-testid="text-sqft">
                      {property.sqft.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
              )}

              {property.parking && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Car className="w-5 h-5 text-gray-400 mr-1" />
                    <span className="text-xl font-semibold" data-testid="text-parking">
                      {property.parking}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Parking</div>
                </div>
              )}
            </div>
          </div>

          {property.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700" data-testid="text-description">
                {property.description}
              </p>
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2" data-testid="property-features">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {property.utilities && property.utilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Utilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="property-utilities">
                {property.utilities?.map((utility) => {
                  const IconComponent = ICONS_MAP[utility.icon] || ICONS_MAP.default;
                  const iconColor =
                    utility.status === "available"
                    ? "text-green-500"
                    : utility.status === "unavailable"
                    ? "text-red-500"
                    : "text-gray-400";
                  return (
                    <div key={utility.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <IconComponent className={`w-4 h-4 mr-2 ${iconColor}`} />
                        <span className="text-sm font-medium">{utility.label}</span>
                      </div>
                      <Badge className={`utility-badge text-xs ${utility.statusColor}`}>
                        {utility.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

