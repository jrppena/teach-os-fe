/**
 * Single source of truth for TeachOS product branding.
 *
 * ILAW is the DepEd/MATATAG lesson-plan FORMAT that TeachOS generates — it is
 * not the product name. Use BRAND.format when referring to the lesson-plan
 * format; use BRAND.name for the product itself.
 */
export const BRAND = {
  /** Public product name shown in UI and copy. */
  name: "TeachOS",
  /** Used in document <title> and meta tags. */
  full: "TeachOS — A platform for teachers",
  /** Short tagline for footer, meta descriptions, and hero subtext. */
  tagline: "The operating system for Filipino teachers.",
  /**
   * The lesson-plan FORMAT TeachOS generates (a DepEd/MATATAG format).
   * Use only when describing the document format, not the product.
   */
  format: "ILAW",
} as const
