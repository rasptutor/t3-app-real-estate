// app/properties/[id]/page.tsx
import { db } from '@/server/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookingForm } from './BookingForm';
import ReviewWrapper from './review-wrapper';
import { auth } from '@/server/auth';
import AvailabilityCalendar from './AvailabilityCalendar';

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  
  const session = await auth();

  const property = await db.property.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      images: true,
      reviews: {
        include: { user: true }, // So you can show who wrote it
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!property) return notFound();

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
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <div className="w-full aspect-[4/3] relative">
        <img
            src={property.imageUrl}
            alt={property.title}
            className="absolute inset-0 w-full h-full object-cover rounded"
        />
      </div>
      <p className="text-lg text-gray-700">{property.description}</p>
      <p>📍 Location: <strong>{property.location}</strong></p>
      <p>💰 Price: <strong>${property.price.toLocaleString()}</strong></p>
      <p>🏠 Type: <strong>{property.propertyType}</strong></p>
      <p>🛏 Bedrooms: <strong>{property.bedrooms}</strong></p>
      <p>🛁 Bathrooms: <strong>{property.bathrooms}</strong></p>
      <p>📅 Available from: <strong>{new Date(property.availableFrom).toLocaleDateString()}</strong></p>
      <p>👤 Owner: <strong>{property.owner?.name}</strong></p>

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
      
      <Link
        href="/properties"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Back to Listings
      </Link>
    </div>
  );
}
