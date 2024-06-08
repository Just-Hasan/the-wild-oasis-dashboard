import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export function useCheckout() {
  const queryClient = useQueryClient();
  const { bookingId: paramId } = useParams();
  const id = Number(paramId);

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(id || bookingId, { status: "checked-out" }),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({
        active: true,
      });
      toast.success(`Booking #${id} successfully checked out`);
    },
    onError: (error) => {
      toast.error(`Failed to checked out booking #${id}`);
      throw new Error(error.message);
    },
  });
  return { checkout, isCheckingOut };
}
