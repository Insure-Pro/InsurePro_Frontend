// src/hooks/useAddCustomerProgress.js
import { useMutation, useQueryClient } from "react-query";
import { addCustomerProgress } from "../../api/customerProgressAPI";

export const useAddCustomerProgress = () => {
  const queryClient = useQueryClient();

  return useMutation(addCustomerProgress, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerProgress");
    },
  });
};
