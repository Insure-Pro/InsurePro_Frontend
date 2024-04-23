// src/hooks/useAddCustomerProgress.js
import { useMutation, useQueryClient } from "react-query";
import { editCustomerProgress } from "../../api/customerProgressAPI";

export const useUpdateCustomerProgress = () => {
  const queryClient = useQueryClient();

  return useMutation(editCustomerProgress, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerProgress");
    },
  });
};
