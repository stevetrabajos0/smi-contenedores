export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface BusinessRulesInput {
  tipoServicio: 'almacenamiento' | 'mudanza' | 'almacenamiento-mudanza' | 'modelo-estandar' | 'personalizado';
  presupuesto: number;
  codigoPostal?: string;
  tieneTerreno?: boolean;
}

export class ValidationService {
  // Minimum budget thresholds by service type
  private readonly MIN_BUDGETS: Record<string, number> = {
    'almacenamiento': 1000,
    'mudanza': 1000,
    'almacenamiento-mudanza': 1000,
    'modelo-estandar': 50000,
    'personalizado': 100000,
  };

  /**
   * Validate postal code format (5 digits)
   * Accepts all valid Mexican postal codes (00000-99999)
   */
  validatePostalCode(codigoPostal: string): ValidationResult {
    const errors: string[] = [];

    if (!codigoPostal || codigoPostal.trim().length === 0) {
      errors.push('El código postal es requerido');
      return { isValid: false, errors };
    }

    const cleanCode = codigoPostal.trim();

    // Check format (5 digits)
    if (!/^\d{5}$/.test(cleanCode)) {
      errors.push('El código postal debe tener 5 dígitos');
      return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Validate WhatsApp number format
   * Accepts any valid Mexican phone number (10 digits, not starting with 0 or 1)
   */
  validateWhatsApp(whatsapp: string): ValidationResult {
    const errors: string[] = [];

    if (!whatsapp || whatsapp.trim().length === 0) {
      errors.push('El número de WhatsApp es requerido');
      return { isValid: false, errors };
    }

    // Remove any non-digit characters
    const digits = whatsapp.replace(/\D/g, '');

    if (digits.length !== 10) {
      errors.push('El número de WhatsApp debe tener 10 dígitos');
      return { isValid: false, errors };
    }

    // Check if it starts with invalid prefix (0 or 1 are not valid area codes in Mexico)
    if (digits[0] === '0' || digits[0] === '1') {
      errors.push('El número de WhatsApp no tiene un formato válido');
      return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Validate business rules based on service type
   */
  validateBusinessRules(input: BusinessRulesInput): ValidationResult {
    const errors: string[] = [];

    // Validate minimum budget
    const minBudget = this.MIN_BUDGETS[input.tipoServicio];
    if (input.presupuesto < minBudget) {
      errors.push(
        `El presupuesto mínimo para ${input.tipoServicio} es de $${minBudget.toLocaleString('es-MX')}`
      );
    }

    // Service-specific validations
    switch (input.tipoServicio) {
      case 'modelo-estandar':
      case 'personalizado':
        // Must specify if they have land
        if (input.tieneTerreno === undefined) {
          errors.push('Debes especificar si cuentas con terreno');
        }
        // If they have land, postal code is required
        if (input.tieneTerreno && input.codigoPostal) {
          const postalValidation = this.validatePostalCode(input.codigoPostal);
          if (!postalValidation.isValid) {
            errors.push(...postalValidation.errors);
          }
        }
        break;

      case 'almacenamiento':
      case 'mudanza':
      case 'almacenamiento-mudanza':
        // Postal code required for delivery
        if (input.codigoPostal) {
          const postalValidation = this.validatePostalCode(input.codigoPostal);
          if (!postalValidation.isValid) {
            errors.push(...postalValidation.errors);
          }
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email || email.trim().length === 0) {
      errors.push('El correo electrónico es requerido');
      return { isValid: false, errors };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('El formato del correo electrónico es inválido');
      return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Comprehensive validation for lead creation
   */
  validateLeadData(data: {
    nombre: string;
    whatsapp: string;
    correo: string;
    tipoServicio: 'almacenamiento' | 'mudanza' | 'almacenamiento-mudanza' | 'modelo-estandar' | 'personalizado';
    presupuesto: number;
    codigoPostal?: string;
    tieneTerreno?: boolean;
  }): ValidationResult {
    const errors: string[] = [];

    // Validate nombre
    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    // Validate WhatsApp
    const whatsappValidation = this.validateWhatsApp(data.whatsapp);
    if (!whatsappValidation.isValid) {
      errors.push(...whatsappValidation.errors);
    }

    // Validate email
    const emailValidation = this.validateEmail(data.correo);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }

    // Validate business rules
    const businessRulesValidation = this.validateBusinessRules({
      tipoServicio: data.tipoServicio,
      presupuesto: data.presupuesto,
      codigoPostal: data.codigoPostal,
      tieneTerreno: data.tieneTerreno,
    });
    if (!businessRulesValidation.isValid) {
      errors.push(...businessRulesValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
