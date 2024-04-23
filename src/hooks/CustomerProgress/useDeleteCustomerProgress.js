// src/hooks/useAddCustomerProgress.js
import { useMutation, useQueryClient } from "react-query";
import { deleteCustomerProgress } from "../../api/customerProgressAPI";

export const useDeleteCustomerProgress = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCustomerProgress, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerProgress");
    },
  });
};
