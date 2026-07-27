/**
 * The allowed email domain for this CRM workspace.
 */
export const COMPANY_DOMAIN = '@quickads.ai';

/**
 * Validates that an email address belongs to the company domain.
 *
 * @param email - The email address to validate.
 * @returns `true` if the email ends with `@quickads.ai`, `false` otherwise.
 *
 * @example
 * validateCompanyEmail('alice@quickads.ai')   // true
 * validateCompanyEmail('alice@gmail.com')     // false
 */
export const validateCompanyEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith(COMPANY_DOMAIN);
};
