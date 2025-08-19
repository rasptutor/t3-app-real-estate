// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: {},
    create: {
      email: 'agent@example.com',
      name: 'Agent Alice',
      role: 'AGENT',
    },
  });

  await prisma.property.createMany({
    data: [
      {
        title: `Seaside Villa`,
        description: 'A beautiful villa by the sea.',
        location: 'Cape Town',
        price: 2500,
        imageUrl: 'https://picsum.photos/id/129/200/300',
        ownerId: user.id,
        propertyType: 'Villa',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Seaside House',
        description: 'A beautiful House by the sea.',
        location: 'Cape Town',
        price: 2200,
        imageUrl: 'https://picsum.photos/id/130/200/300',
        ownerId: user.id,
        propertyType: 'House',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Seaside Apartment',
        description: 'A beautiful Apartment by the sea.',
        location: 'Cape Town',
        price: 2000,
        imageUrl: 'https://picsum.photos/id/131/200/300',
        ownerId: user.id,
        propertyType: 'Apartment',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Seaside Cottage',
        description: 'A beautiful Cottage by the sea.',
        location: 'Cape Town',
        price: 1800,
        imageUrl: 'https://picsum.photos/id/133/200/300',
        ownerId: user.id,
        propertyType: 'Cottage',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Seaside Apartment',
        description: 'A beautiful Apartment by the sea.',
        location: 'Cape Town',
        price: 2200,
        imageUrl: 'https://picsum.photos/id/154/200/300',
        ownerId: user.id,
        propertyType: 'Apartment',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Urban Apartment',
        description: 'Modern apartment in the city center.',
        location: 'Johannesburg',
        price: 1500,
        imageUrl: 'https://picsum.photos/id/212/200/300',
        ownerId: user.id,
        propertyType: 'Apartment',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Urban House',
        description: 'Modern house in the city center.',
        location: 'Johannesburg',
        price: 2500,
        imageUrl: 'https://picsum.photos/id/311/200/300',
        ownerId: user.id,
        propertyType: 'House',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Urban Cottage',
        description: 'Modern cottage in the city center.',
        location: 'Johannesburg',
        price: 1300,
        imageUrl: 'https://picsum.photos/id/308/200/300',
        ownerId: user.id,
        propertyType: 'Cottage',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Urban Villa',
        description: 'Modern villa in the city center.',
        location: 'Johannesburg',
        price: 2300,
        imageUrl: 'https://picsum.photos/id/305/200/300',
        ownerId: user.id,
        propertyType: 'Villa',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
      {
        title: 'Urban Apartment',
        description: 'Modern apartment in the city center.',
        location: 'Johannesburg',
        price: 1900,
        imageUrl: 'https://picsum.photos/id/299/200/300',
        ownerId: user.id,
        propertyType: 'Apartment',
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        availableFrom: faker.date.future(),
      },
    ],
  });

  console.log('🌱 Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

