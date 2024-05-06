export const formatPhoneNumber = (phoneNumber) => {
  const numbers = phoneNumber.replace(/\D/g, "");
  const match = numbers.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : numbers;
};

export const handlePhoneInputChange = (event, setPhoneNumber) => {
  const formattedNumber = formatPhoneNumber(event.target.value);
  setPhoneNumber(formattedNumber);
};
