// app/properties/[id]/page.tsx
import { db } from '@/server/db';
import { notFound } from 'next/navigation';
import { BookingForm } from './BookingForm';
import ReviewWrapper from './review-wrapper';
import { auth } from '@/server/auth';
import AvailabilityCalendar from './AvailabilityCalendar';
import PropertyDetailsHeader from './PropertyDetailsHeader';
import PropertyDetailsOverview from './PropertyDetailsOverview';
import { Bed, Bath, Car, Square, MapPin } from "lucide-react";
import PropertyAgent from './PropertyAgent';

const ICONS_MAP: Record<string, any> = {
  bed: Bed,
  bath: Bath,
  car: Car,
  sqft: Square,
  mapPin: MapPin,
};

export function getIcon(name: string) {
  return ICONS_MAP[name] || Square; // fallback icon
}

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  
  const session = await auth();

  const listingTypeMap = {
    sale: { label: "For Sale", bgColor: "bg-green-100", textColor: "text-green-800" },
    rent: { label: "For Rent", bgColor: "bg-blue-100", textColor: "text-blue-800" },
  };  

  const property = await db.property.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      images: true,
      agent: true,
      reviews: {
        include: { user: true }, // So you can show who wrote it
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!property) return notFound();

  console.log("UTILITIES RAW:", property?.utilities);

  const utilities = property.utilities
  ? Object.entries(property.utilities).map(([key, status]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1), // simple label
      status,
      statusColor: status === "available" ? "text-green-600" : "text-red-600",
      icon: key, // fallback handled in getIcon
    }))
  : null;

  // If user is logged in, try to find their booking for this property
  let booking = null;
  if (session?.user) {
    booking = await db.booking.findFirst({
      where: {
        propertyId: property.id,
        userId: session.user.id,
        endDate: { lt: new Date() }, // Only allow review after stay
        review: null, // Prevent duplicates
      },
    });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <PropertyDetailsHeader/>
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <div className="w-full aspect-[4/3] relative">
        {/* Cover image */}
        {property.images.length > 0 ? (
          <div className="w-full aspect-[4/3] relative">
            <img
              src={property.images[0]?.url}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <section className="mt-4 grid grid-cols-3 gap-2">
        {property.images.slice(1).map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={`${property.title} image`}
            className="w-full h-32 object-cover rounded border"
          />
        ))}
      </section> 
      <PropertyDetailsOverview property={{
        ...property,
        listingType: listingTypeMap[property.listingType as "sale" | "rent"],
        utilities,
        price: property.price,
        rentPrice: property.rentPrice,
      }}/>
      
      <p>🏠 Type: <strong>{property.propertyType}</strong></p>      
      <p>📅 Available from: <strong>{new Date(property.availableFrom).toLocaleDateString()}</strong></p>
      <p>👤 Owner: <strong>{property.owner?.name}</strong></p>

      <PropertyAgent property={property}/>

      <AvailabilityCalendar propertyId={property.id} />

      <BookingForm propertyId={property.id} />

      {booking && (
        <ReviewWrapper bookingId={booking.id} propertyId={property.id} />
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-2">Reviews</h2>

        {property.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {property.reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded shadow-sm">
                <div className="text-sm text-gray-600">
                  {review.user?.name || "Anonymous"} on{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
                <div className="font-semibold">{"⭐".repeat(review.rating)}</div>
                <p className="text-gray-800">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>          
      
    </div>
  );
}
