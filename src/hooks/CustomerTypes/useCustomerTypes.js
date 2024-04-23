// src/hooks/useCustomerTypes.js
import { useQuery } from "react-query";
import { fetchCustomerTypes } from "../../api/customerTypesAPI";

export const useCustomerTypes = () => {
  return useQuery("customerTypes", fetchCustomerTypes);
};
