import { 
  Home, 
  Building, 
  Building2, 
  MapPin, 
  Factory, 
  Store, 
  Warehouse, 
  TreePine, 
  Zap, 
  Droplets, 
  Flame, 
  Trash2, 
  Wifi, 
  Tv, 
  Phone, 
  Thermometer, 
  Wind 
} from "lucide-react";

export const PROPERTY_CATEGORIES = {
  residential: {
    label: "Residential",
    icon: Home,
    types: {
      house: "Houses",
      apartment: "Apartments", 
      condo: "Condos",
      townhouse: "Townhouses",
      villa: "Villas",
      studio: "Studio Apartments",
      penthouse: "Penthouses",
      duplex: "Duplexes",
      loft: "Lofts",
      mobile: "Mobile Homes"
    }
  },
  commercial: {
    label: "Commercial",
    icon: Building,
    types: {
      office: "Office Spaces",
      retail: "Retail Spaces", 
      warehouse: "Warehouses",
      industrial: "Industrial Properties"
    }
  },
  land: {
    label: "Land",
    icon: MapPin,
    types: {
      vacant: "Vacant Land",
      building_lots: "Building Lots",
      agricultural: "Agricultural Land"
    }
  },
  specialty: {
    label: "Specialty",
    icon: Building2,
    types: {
      mixed_use: "Mixed-Use",
      investment: "Investment Properties",
      vacation: "Vacation Rentals"
    }
  }
};

export const UTILITY_TYPES = {
  electricity: {
    label: "Electricity",
    icon: Zap,
    color: "yellow"
  },
  water: {
    label: "Water",
    icon: Droplets,
    color: "blue"
  },
  gas: {
    label: "Gas",
    icon: Flame,
    color: "orange"
  },
  sewage: {
    label: "Sewage",
    icon: Droplets,
    color: "gray"
  },
  trash: {
    label: "Trash Collection",
    icon: Trash2,
    color: "green"
  },
  internet: {
    label: "Internet",
    icon: Wifi,
    color: "blue"
  },
  cable: {
    label: "Cable TV",
    icon: Tv,
    color: "purple"
  },
  phone: {
    label: "Phone",
    icon: Phone,
    color: "gray"
  },
  heating: {
    label: "Heating",
    icon: Thermometer,
    color: "red"
  },
  cooling: {
    label: "Central Air",
    icon: Wind,
    color: "blue"
  }
};

export const UTILITY_STATUS = {
  included: {
    label: "Included",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800"
  },
  available: {
    label: "Available",
    color: "blue", 
    bgColor: "bg-blue-100",
    textColor: "text-blue-800"
  },
  not_available: {
    label: "Not Available",
    color: "red",
    bgColor: "bg-red-100", 
    textColor: "text-red-800"
  },
  tenant_responsibility: {
    label: "Tenant Responsibility",
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800"
  }
};

export const PROPERTY_TYPE_ICONS = {
  house: Home,
  apartment: Building,
  condo: Building2,
  townhouse: Home,
  villa: Home,
  studio: Building,
  penthouse: Building2,
  duplex: Home,
  loft: Building,
  mobile: Home,
  office: Building,
  retail: Store,
  warehouse: Warehouse,
  industrial: Factory,
  vacant: MapPin,
  building_lots: MapPin,
  agricultural: TreePine,
  mixed_use: Building2,
  investment: Building,
  vacation: Home
};

export const LISTING_TYPES = {
  sale: {
    label: "For Sale",
    color: "green",
    bgColor: "bg-secondary",
    textColor: "text-white"
  },
  rent: {
    label: "For Rent", 
    color: "orange",
    bgColor: "bg-accent",
    textColor: "text-white"
  }
};

export const PRICE_RANGES = {
  sale: [
    { label: "Any Price", min: 0, max: null },
    { label: "$0 - $300K", min: 0, max: 300000 },
    { label: "$300K - $500K", min: 300000, max: 500000 },
    { label: "$500K - $1M", min: 500000, max: 1000000 },
    { label: "$1M+", min: 1000000, max: null }
  ],
  rent: [
    { label: "Any Rent", min: 0, max: null },
    { label: "$0 - $1,500", min: 0, max: 1500 },
    { label: "$1,500 - $2,500", min: 1500, max: 2500 },
    { label: "$2,500 - $4,000", min: 2500, max: 4000 },
    { label: "$4,000+", min: 4000, max: null }
  ]
};

export const BEDROOM_OPTIONS = [
  { label: "Any", value: null },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
  { label: "5+", value: 5 }
];

export const BATHROOM_OPTIONS = [
  { label: "Any", value: null },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 }
];

export const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "date_desc" },
  { label: "Square Footage", value: "sqft_desc" },
  { label: "Bedrooms", value: "bedrooms_desc" }
];

export const AVAILABLE_TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM", 
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM"
];

export const formatPrice = (price: string | null, type: "sale" | "rent" = "sale") => {
  if (!price) return "Price on request";
  const numPrice = parseFloat(price);
  
  if (type === "rent") {
    return `$${numPrice.toLocaleString()}/month`;
  }
  
  if (numPrice >= 1000000) {
    return `$${(numPrice / 1000000).toFixed(1)}M`;
  } else if (numPrice >= 1000) {
    return `$${(numPrice / 1000).toFixed(0)}K`;
  }
  return `$${numPrice.toLocaleString()}`;
};

export const formatAddress = (property: any) => {
  return `${property.address}, ${property.city}`;
};

export const formatPropertyStats = (property: any) => {
  const stats = [];
  
  if (property.bedrooms) {
    stats.push(`${property.bedrooms} bed`);
  }
  
  if (property.bathrooms) {
    stats.push(`${property.bathrooms} bath`);
  }
  
  if (property.sqft) {
    stats.push(`${property.sqft.toLocaleString()} sq ft`);
  }
  
  return stats.join(" • ");
};