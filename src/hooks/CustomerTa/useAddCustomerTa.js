// src/hooks/CustomerTa/useAddCustomerTa.js
import { useMutation, useQueryClient } from "react-query";
import { addCustomerTa } from "../../api/customerTaAPI";

export const useAddCustomerTa = () => {
  const queryClient = useQueryClient();

  return useMutation(addCustomerTa, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerTa");
    },
  });
};
