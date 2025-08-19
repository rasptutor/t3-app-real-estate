-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
