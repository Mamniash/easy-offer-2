export const PRO_EMAILS = ["mamniashvili2003@gmail.com", "pokrasov.04@mail.ru"];

export const isProEmail = (email?: string | null) => {
  if (!email) return false;
  return PRO_EMAILS.includes(email.toLowerCase());
};
