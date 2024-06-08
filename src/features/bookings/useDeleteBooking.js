import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSingleBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { mutate: deleteBooking, isLoading: isDeletingBooking } = useMutation({
    mutationFn: ({ bookingId }) => deleteSingleBooking(bookingId),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ active: true });
      toast.success(`Booking #${bookingId} is successfully deleted `);
    },
    onError: (error) => {
      toast.error("Error deleting cabin");
      throw new Error(error.message);
    },
  });

  return { deleteBooking, isDeletingBooking };
}
