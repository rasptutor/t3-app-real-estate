// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: {},
    create: {
      email: 'agent@example.com',
      name: 'Agent Alice',
      role: 'AGENT',
    },
  });

  // Create agencies
  const agency1 = await prisma.agency.create({
    data: {
      name: "Prime City Realty",
      description: "Luxury properties specialist with over 20 years of experience",
      specialization: "Luxury Properties Specialist",
      rating: 4.9,
      reviewCount: 127,
      activeListings: 89,
      salesThisYear: 234,
      phone: "(555) 123-4567",
      email: "info@primecity.com",
      address: "123 Downtown Plaza, Metropolitan City",
      website: "www.primecityrealty.com",
    },
  });

  const agency2 = await prisma.agency.create({
    data: {
      name: "Metro Home Solutions",
      description: "Your trusted partner for residential and commercial properties",
      specialization: "Residential & Commercial",
      rating: 4.7,
      reviewCount: 98,
      activeListings: 65,
      salesThisYear: 178,
      phone: "(555) 987-6543",
      email: "contact@metrohome.com",
      address: "456 Business District, Metropolitan City",
      website: "www.metrohomesolutions.com",
    },
  });

  // Create agents
  const agent1 = await prisma.agent.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah@primecity.com",
      phone: "(555) 123-4567",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      agencyId: agency1.id,
      specialization: "Luxury Homes",
      yearsExperience: 8,
    },
  });

  const agent2 = await prisma.agent.create({
    data: {
      name: "Mike Rodriguez",
      email: "mike@metrohome.com",
      phone: "(555) 987-6543",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      agencyId: agency2.id,
      specialization: "Commercial Properties",
      yearsExperience: 12,
    },
  });

  // Properties data
  const properties = [
    {
      title: "Modern Luxury House",
      description: "Beautiful modern home with stunning architecture and premium finishes",
      location: "1234 Maple Street, Downtown, CA",
      price: 875000,
      rentPrice: 0,
      propertyType: "house",
      listingType: "sale",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2450,
      parking: 2,
      features: ["Central Air", "Hardwood Floors", "Modern Kitchen", "Garden", "Garage"],
      utilities: {
        electricity: "available",
        water: "available",
        gas: "available",
        sewage: "available",
        trash: "available",
        internet: "available",
        cable: "available",
        phone: "available",
        heating: "available",
        cooling: "available",
      },
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      ],
      agencyId: agency1.id,
      agentId: agent1.id,
    },
    {
      title: "Downtown Apartment",
      description: "Spacious apartment in the heart of downtown with city views",
      location: "789 City Center Blvd, Downtown, CA",
      price: 0,
      rentPrice: 2800,
      propertyType: "apartment",
      listingType: "rent",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      parking: 1,
      features: ["City Views", "Modern Appliances", "Fitness Center", "Rooftop Terrace"],
      utilities: {
        electricity: "tenant_responsibility",
        water: "included",
        gas: "included",
        sewage: "included",
        trash: "included",
        internet: "available",
        cable: "available",
        phone: "available",
        heating: "included",
        cooling: "included",
      },
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      ],
      agencyId: agency2.id,
      agentId: agent2.id,
    },
    {
      title: "Elegant Townhouse",
      description: "Three-story townhouse with private garden and modern amenities",
      location: "321 Garden Lane, Downtown, CA",      
      price: 650000,
      rentPrice: 0,
      propertyType: "townhouse",         
      listingType: "sale",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,      
      parking: 2,
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      ],
      features: ["Private Garden", "Modern Kitchen", "Walk-in Closets", "Patio"],
      utilities: {
        electricity: "available",
        water: "available",
        gas: "available",
        sewage: "available",
        trash: "available",
        internet: "available",
        cable: "available",
        phone: "available",
        heating: "available",
        cooling: "available"
      },      
      agencyId: agency1.id,
      agentId: agent1.id,      
    },
  ];

  for (const prop of properties) {
    const createdProperty = await prisma.property.create({
      data: {
        title: prop.title,
        description: prop.description,
        location: prop.location,
        price: prop.price,
        rentPrice: prop.rentPrice,
        propertyType: prop.propertyType,
        listingType: prop.listingType,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        sqft: prop.sqft,
        parking: prop.parking,
        features: prop.features,
        utilities: prop.utilities,
        ownerId: owner.id,
        availableFrom: new Date(),
        agencyId: prop.agencyId,
        agentId: prop.agentId,
      },
    });

    // Create property images
    for (const url of prop.images) {
      await prisma.propertyImage.create({
        data: {
          url,
          key: url.split("/").pop()!,
          propertyId: createdProperty.id,
        },
      });
    }
  }  

  console.log('🌱 Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

