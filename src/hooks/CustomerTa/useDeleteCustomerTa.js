// src/hooks/CustomerTa/useAddCustomerTa.js
import { useMutation, useQueryClient } from "react-query";
import { deleteCustomerTa } from "../../api/customerTaAPI";

export const useDeleteCustomerTa = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCustomerTa, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerTa");
    },
  });
};
