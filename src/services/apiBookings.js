import { PAGE_SIZE } from "../utils/constance";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBooking(id) {
  const { data } = await supabase
    .from("bookings")
    .select("*, cabins(name), guests(fullName,email)")
    .eq("id", id)
    .single();

  return data;
}

export async function getAllBookings({ filter, sortBy, page }) {
  let query;
  query = supabase
    .from("bookings")
    .select("*, cabins(name), guests(fullName,email)", { count: "exact" });

  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  }

  /*
  /////////////////////////////////////[Changing the return data base on page]
  So basically, the logic behind how the return data
  is different base on the page changes.
  1. Example, if :
     page = 2 
     PAGE_SIZE = 10
  2. from = (2 - 1) * 10 = 10
     to = 10 + 10 - 1 = 19
     thie means range (10, 19) -> getting items from index 10 - 99

  NOTE : range is a method in supabase that we can use to determine how many data, and from what to what index, our item will be returned
  */

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error("Bookings couldn't be found");
  }

  return { data, count };
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date needs to be an ISOString

/*
////////[Logic of getBookingsAfterDate]
1. We select the bookings table from supabase
2. And select the created_at, totalPrice, and extrasPrice column
3. We then get the data that has been created on and after
   the date we receive in the param by using the gte (greater than equal)
4. But we also limit the data we receive by using the lte (lower than equal)
   the data created today
*/
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const today = getToday({ options: true });
  console.log(`Today's date: ${today}`); // Log the date

  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .neq("status", "checked-out")
    .limit(10);

  if (error) {
    console.error("Error fetching bookings:", error); // Log detailed error
    throw new Error("Bookings could not get loaded");
  }

  console.log("Bookings data:", data); // Log the data response
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    // to update, supabase it receives an object of key value pair,
    // key = name of column that we wanna update
    // value = the new update value
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

// export async function deleteBooking(id) {
//   // REMEMBER RLS POLICIES
//   const { data, error } = await supabase.from("bookings").delete().eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be deleted");
//   }
//   return data;
// }

export async function deleteSingleBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return data;
}
