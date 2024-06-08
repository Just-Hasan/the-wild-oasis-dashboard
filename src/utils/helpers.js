import { formatDistance, parseISO, differenceInDays } from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
/*
////////[Logic of getToday]
1. This function accepts options object that has the default value of empty object
2. Today variable holds today's date
3. If the options has a property of end that has the value of true
4. Then by using the setUTCHours, we set today variable to have have value
   of today but at the very end of the day
5. If end property doesn't exist, then today will have the value of the beginning of day

NOTE : But why it needs to be like this? because working with milliseconds can lead to inconsistencies
cuz it's changing everytime, but by getting the today with this approach, we can get a fixed time of today
(end of day or beginning of day)
*/
export const getToday = function (options = {}) {
  const today = new Date();
  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );
