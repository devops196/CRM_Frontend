/**
 * The allowed email domain for this CRM workspace.
 */
export const COMPANY_DOMAIN = '@quickads.ai';

/**
 * Validates that an email address belongs to the company domain.
 */
export const validateCompanyEmail = (email) => {
  return email ? email.toLowerCase().endsWith(COMPANY_DOMAIN) : false;
};
