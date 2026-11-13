/** Formats a US phone number as it is typed: (000) 000-0000. International numbers are left alone. */
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  // Starts with + or has more than 10 digits: probably not a US number.
  if (value.startsWith("+") || digits.length > 10) {
    return value;
  }

  if (digits.length <= 3) {
    return digits.length > 0 ? `(${digits}` : "";
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};
