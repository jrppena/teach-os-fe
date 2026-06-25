
/* -------------------------------------------------------------------------- */
/*  Validation helpers                                                          */
/* -------------------------------------------------------------------------- */

export function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."
  }
  export function validatePassword(v: string) {
    return v.length >= 8 ? "" : "Password must be at least 8 characters."
  }
  export function validateRequired(label: string) {
    return (v: string) => (v.trim() ? "" : `${label} is required.`)
  }