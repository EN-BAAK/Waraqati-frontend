export const handlePhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) return;

  const sanitizedNumber = phoneNumber.replace(/\s|-/g, "");

  window.location.href = `tel:${sanitizedNumber}`;
};
