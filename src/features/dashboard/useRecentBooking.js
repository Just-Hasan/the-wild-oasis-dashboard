import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";

export function useRecentBooking() {
  const [searchParams] = useSearchParams();
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));
  /*
    ////////[Logic Below]
    1. subDays is a function that subtract number of days from the given date, so
    in the first param we give the today date, and the second is the number of days,
    it'll return the date of = today - num days
    example : thursday - 2 = tuesday
    2. And then convert it to ISOString
    3. ISOString -> format to shows date so humans and computer can read it easier
    4. Basically the queryDate holds the date before today
    */
  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading: isGettingRecentBooking, data: bookings } = useQuery({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ["bookings", `last-${numDays}`],
  });

  return { isGettingRecentBooking, bookings };
}
