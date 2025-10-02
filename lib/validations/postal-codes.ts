// Hermosillo postal codes (83000-83299 range)
export const VALID_POSTAL_CODES = Array.from({ length: 300 }, (_, i) => {
  return (83000 + i).toString();
});

export function isValidPostalCode(postalCode: string): boolean {
  return VALID_POSTAL_CODES.includes(postalCode);
}

export function getPostalCodeError(postalCode: string): string | null {
  if (!postalCode) {
    return 'El código postal es requerido';
  }

  if (postalCode.length !== 5) {
    return 'El código postal debe tener 5 dígitos';
  }

  if (!/^\d+$/.test(postalCode)) {
    return 'El código postal solo debe contener números';
  }

  if (!isValidPostalCode(postalCode)) {
    return 'Lo sentimos, no entregamos en este código postal';
  }

  return null;
}
