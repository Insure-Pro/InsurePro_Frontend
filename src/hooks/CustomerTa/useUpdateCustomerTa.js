// src/hooks/CustomerTa/useAddCustomerProgress.js
import { useMutation, useQueryClient } from "react-query";
import { editCustomerTa } from "../../api/customerTaAPI";

export const useUpdateCustomerTa = () => {
  const queryClient = useQueryClient();

  return useMutation(editCustomerTa, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerTa");
    },
  });
};
