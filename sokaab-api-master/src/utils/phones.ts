export const checkEdahabPhoneNumber = (phone: string) => {
  return (
    phone.startsWith('25265') ||
    phone.startsWith('25266') ||
    phone.startsWith('25262') ||
    phone.startsWith('25264')
  );
};

export const checkWaafiPhoneNumber = (phone: string) => {
  return phone.startsWith('25263') || phone.startsWith('25261');
};
