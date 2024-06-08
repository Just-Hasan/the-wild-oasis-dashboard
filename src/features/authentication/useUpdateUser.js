import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: async (data) => {
      console.log(data);
      return await updateCurrentUser(data);
    },
    onSuccess: ({ user }) => {
      //   queryClient.setQueryData(["user"], user.id);
      queryClient.invalidateQueries(["user"], user.id);
      toast.success("Successfully updated user account");
    },
    onError: (err) => {
      toast.error("Error updating user account: " + err.message);
    },
  });

  return { updateUser, isUpdatingUser };
}
