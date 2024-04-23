// src/hooks/useAddCustomerType.js
import { useMutation, useQueryClient } from "react-query";
import { addCustomerType } from "../../api/customerTypesAPI";

export const useAddCustomerType = () => {
  const queryClient = useQueryClient();

  return useMutation(addCustomerType, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerTypes");
    },
  });
};
