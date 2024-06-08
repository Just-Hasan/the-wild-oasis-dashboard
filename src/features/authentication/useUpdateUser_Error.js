import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: (data) => {
      console.log(data);
      return updateCurrentUser(data);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(["user"]);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toast.success("Sucessfully update user account");
    },
    onError: (err) => {
      toast.error("Error updating user account");
      throw new Error(err.message);
    },
  });

  return { updateUser, isUpdatingUser };
}
