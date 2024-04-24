// src/hooks/CustomerTa/useCustomerTa.js
import { useQuery } from "react-query";
import { fetchCustomerTa } from "../../api/customerTaAPI";

export const useCustomerTa = (customerPk) => {
  return useQuery(
    ["customerTa", customerPk],
    () => fetchCustomerTa(customerPk),
    {
      enabled: !!customerPk, // only run query if customerPk is not null or undefined
    },
  );
};
