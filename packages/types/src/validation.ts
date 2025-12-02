/**
 * Shared validation constants and functions for opportunity creation/editing
 */

export const OPPORTUNITY_VALIDATION = {
  title: {
    minLength: 3,
    maxLength: 200,
  },
  shortSummary: {
    minLength: 10,
    maxLength: 500,
  },
  description: {
    minLength: 50,
    maxLength: 5000,
  },
  contactName: {
    minLength: 2,
  },
  contactPhone: {
    minLength: 10,
  },
  maxVolunteers: {
    min: 1,
    max: 10000,
  },
} as const;

export const VALIDATION_MESSAGES = {
  title: {
    required: 'Title is required',
    tooShort: `Title must be at least ${OPPORTUNITY_VALIDATION.title.minLength} characters`,
    tooLong: `Title must be less than ${OPPORTUNITY_VALIDATION.title.maxLength} characters`,
  },
  shortSummary: {
    required: 'Short summary is required',
    tooShort: `Short summary must be at least ${OPPORTUNITY_VALIDATION.shortSummary.minLength} characters`,
    tooLong: `Short summary must be less than ${OPPORTUNITY_VALIDATION.shortSummary.maxLength} characters`,
  },
  description: {
    required: 'Description is required',
    tooShort: `Description must be at least ${OPPORTUNITY_VALIDATION.description.minLength} characters`,
    tooLong: `Description must be less than ${OPPORTUNITY_VALIDATION.description.maxLength} characters`,
  },
  contactName: {
    required: 'Contact name is required',
    tooShort: `Contact name must be at least ${OPPORTUNITY_VALIDATION.contactName.minLength} characters`,
  },
  contactEmail: {
    required: 'Contact email is required',
    invalid: 'Please enter a valid email address',
  },
  contactPhone: {
    required: 'Contact phone is required',
    invalid: 'Please enter a valid phone number',
    tooShort: `Phone number must be at least ${OPPORTUNITY_VALIDATION.contactPhone.minLength} digits`,
  },
  maxVolunteers: {
    required: 'Maximum volunteers is required',
    invalid: `Maximum volunteers must be between ${OPPORTUNITY_VALIDATION.maxVolunteers.min} and ${OPPORTUNITY_VALIDATION.maxVolunteers.max}`,
  },
  address: {
    requiredOnsite: 'Address is required for onsite opportunities',
    requiredHybrid: 'Address is required for hybrid opportunities',
  },
  city: {
    requiredOnsite: 'City is required for onsite opportunities',
    requiredHybrid: 'City is required for hybrid opportunities',
  },
  state: {
    requiredOnsite: 'State is required for onsite opportunities',
    requiredHybrid: 'State is required for hybrid opportunities',
  },
  country: {
    requiredOnsite: 'Country is required for onsite opportunities',
    requiredHybrid: 'Country is required for hybrid opportunities',
  },
  dates: {
    startDateRequiredSingle: 'Start date is required for single day opportunities',
    startDateRequiredMulti: 'Start date is required for multi-day opportunities',
    startDatePast: 'Start date cannot be in the past',
    endDateRequiredMulti: 'Multi-day opportunities must have an end date',
    endDateAfterStart: 'End date must be after start date',
    endDatePast: 'End date cannot be in the past',
    endDateNotAllowedSingle: 'Single day opportunities should not have an end date',
  },
  url: {
    invalid: 'Please enter a valid URL',
  },
} as const;

export type OpportunityFormData = {
  title: string;
  shortSummary: string;
  description: string;
  causeCategory: string;
  mode: 'onsite' | 'remote' | 'hybrid';
  dateType: 'single_day' | 'multi_day' | 'ongoing';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  osrmLink?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  maxVolunteers?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  [key: string]: any;
};

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateTitle(value: any): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: VALIDATION_MESSAGES.title.required };
  }
  const str = typeof value === 'string' ? value.trim() : String(value);
  if (str.length < OPPORTUNITY_VALIDATION.title.minLength) {
    return { valid: false, error: VALIDATION_MESSAGES.title.tooShort };
  }
  if (str.length > OPPORTUNITY_VALIDATION.title.maxLength) {
    return { valid: false, error: VALIDATION_MESSAGES.title.tooLong };
  }
  return { valid: true };
}

export function validateShortSummary(value: any): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: VALIDATION_MESSAGES.shortSummary.required };
  }
  const str = typeof value === 'string' ? value.trim() : String(value);
  if (str.length < OPPORTUNITY_VALIDATION.shortSummary.minLength) {
    return { valid: false, error: VALIDATION_MESSAGES.shortSummary.tooShort };
  }
  if (str.length > OPPORTUNITY_VALIDATION.shortSummary.maxLength) {
    return { valid: false, error: VALIDATION_MESSAGES.shortSummary.tooLong };
  }
  return { valid: true };
}

export function validateDescription(value: any): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: VALIDATION_MESSAGES.description.required };
  }
  const str = typeof value === 'string' ? value.trim() : String(value);
  if (str.length < OPPORTUNITY_VALIDATION.description.minLength) {
    return { valid: false, error: VALIDATION_MESSAGES.description.tooShort };
  }
  if (str.length > OPPORTUNITY_VALIDATION.description.maxLength) {
    return { valid: false, error: VALIDATION_MESSAGES.description.tooLong };
  }
  return { valid: true };
}

export function validateContactName(value: any): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: VALIDATION_MESSAGES.contactName.required };
  }
  const str = typeof value === 'string' ? value.trim() : String(value);
  if (str.length < OPPORTUNITY_VALIDATION.contactName.minLength) {
    return { valid: false, error: VALIDATION_MESSAGES.contactName.tooShort };
  }
  return { valid: true };
}

export function validateContactEmail(value: any): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: VALIDATION_MESSAGES.contactEmail.required };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const str = typeof value === 'string' ? value.trim() : String(value);
  if (!emailRegex.test(str)) {
    return { valid: false, error: VALIDATION_MESSAGES.contactEmail.invalid };
  }
  return { valid: true };
}

export function validateContactPhone(value: any): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: VALIDATION_MESSAGES.contactPhone.required };
  }
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const str = typeof value === 'string' ? value.trim() : String(value);
  if (!phoneRegex.test(str) || str.replace(/\D/g, '').length < OPPORTUNITY_VALIDATION.contactPhone.minLength) {
    return { valid: false, error: VALIDATION_MESSAGES.contactPhone.invalid };
  }
  return { valid: true };
}

export function validateMaxVolunteers(value: any): ValidationResult {
  if (value === undefined || value === null) {
    return { valid: false, error: VALIDATION_MESSAGES.maxVolunteers.required };
  }
  const num = typeof value === 'number' ? value : parseInt(String(value), 10);
  if (isNaN(num) || num < OPPORTUNITY_VALIDATION.maxVolunteers.min || num > OPPORTUNITY_VALIDATION.maxVolunteers.max) {
    return { valid: false, error: VALIDATION_MESSAGES.maxVolunteers.invalid };
  }
  return { valid: true };
}

export function validateUrl(value?: any): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: true }; // Optional field
  }
  try {
    const str = typeof value === 'string' ? value.trim() : String(value);
    new URL(str);
    return { valid: true };
  } catch {
    return { valid: false, error: VALIDATION_MESSAGES.url.invalid };
  }
}

export function validateAddress(value: any, mode: 'onsite' | 'remote' | 'hybrid'): ValidationResult {
  if (mode === 'remote') {
    return { valid: true };
  }
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { 
      valid: false, 
      error: mode === 'onsite' 
        ? VALIDATION_MESSAGES.address.requiredOnsite 
        : VALIDATION_MESSAGES.address.requiredHybrid 
    };
  }
  return { valid: true };
}

export function validateCity(value: any, mode: 'onsite' | 'remote' | 'hybrid'): ValidationResult {
  if (mode === 'remote') {
    return { valid: true };
  }
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { 
      valid: false, 
      error: mode === 'onsite' 
        ? VALIDATION_MESSAGES.city.requiredOnsite 
        : VALIDATION_MESSAGES.city.requiredHybrid 
    };
  }
  return { valid: true };
}

export function validateState(value: any, mode: 'onsite' | 'remote' | 'hybrid'): ValidationResult {
  if (mode === 'remote') {
    return { valid: true };
  }
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { 
      valid: false, 
      error: mode === 'onsite' 
        ? VALIDATION_MESSAGES.state.requiredOnsite 
        : VALIDATION_MESSAGES.state.requiredHybrid 
    };
  }
  return { valid: true };
}

export function validateCountry(value: any, mode: 'onsite' | 'remote' | 'hybrid'): ValidationResult {
  if (mode === 'remote') {
    return { valid: true };
  }
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { 
      valid: false, 
      error: mode === 'onsite' 
        ? VALIDATION_MESSAGES.country.requiredOnsite 
        : VALIDATION_MESSAGES.country.requiredHybrid 
    };
  }
  return { valid: true };
}

export function validateStartDate(
  value: any,
  dateType: 'single_day' | 'multi_day' | 'ongoing'
): ValidationResult {
  if (dateType === 'ongoing' && !value) {
    return { valid: true };
  }
  
  if (dateType !== 'ongoing' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
    return { 
      valid: false, 
      error: dateType === 'single_day' 
        ? VALIDATION_MESSAGES.dates.startDateRequiredSingle 
        : VALIDATION_MESSAGES.dates.startDateRequiredMulti 
    };
  }

  if (value) {
    const date = new Date(value);
    if (date < new Date()) {
      return { valid: false, error: VALIDATION_MESSAGES.dates.startDatePast };
    }
  }

  return { valid: true };
}

export function validateEndDate(
  value: any,
  dateType: 'single_day' | 'multi_day' | 'ongoing',
  startDate?: string
): ValidationResult {
  if (dateType === 'single_day') {
    return value ? { valid: false, error: VALIDATION_MESSAGES.dates.endDateNotAllowedSingle } : { valid: true };
  }

  if (dateType === 'multi_day' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
    return { valid: false, error: VALIDATION_MESSAGES.dates.endDateRequiredMulti };
  }

  if (value) {
    const endDate = new Date(value);
    
    if (!startDate && dateType === 'ongoing' && endDate < new Date()) {
      return { valid: false, error: VALIDATION_MESSAGES.dates.endDatePast };
    }

    if (startDate && endDate <= new Date(startDate)) {
      return { valid: false, error: VALIDATION_MESSAGES.dates.endDateAfterStart };
    }
  }

  return { valid: true };
}

export function validateOpportunityField(
  field: string,
  value: any,
  formData: OpportunityFormData
): string | undefined {
  switch (field) {
    case 'title':
      return validateTitle(value).error;
    case 'shortSummary':
      return validateShortSummary(value).error;
    case 'description':
      return validateDescription(value).error;
    case 'contactName':
      return validateContactName(value).error;
    case 'contactEmail':
      return validateContactEmail(value).error;
    case 'contactPhone':
      return validateContactPhone(value).error;
    case 'maxVolunteers':
      return validateMaxVolunteers(value).error;
    case 'osrmLink':
      return validateUrl(value).error;
    case 'address':
      return validateAddress(value, formData.mode).error;
    case 'city':
      return validateCity(value, formData.mode).error;
    case 'state':
      return validateState(value, formData.mode).error;
    case 'country':
      return validateCountry(value, formData.mode).error;
    case 'startDate':
      return validateStartDate(value, formData.dateType).error;
    case 'endDate':
      return validateEndDate(value, formData.dateType, formData.startDate).error;
    default:
      return undefined;
  }
}

export function validateOpportunityForm(formData: OpportunityFormData): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const titleError = validateTitle(formData.title).error;
  if (titleError) errors.title = titleError;

  const shortSummaryError = validateShortSummary(formData.shortSummary).error;
  if (shortSummaryError) errors.shortSummary = shortSummaryError;

  const descriptionError = validateDescription(formData.description).error;
  if (descriptionError) errors.description = descriptionError;

  if (formData.mode !== 'remote') {
    const addressError = validateAddress(formData.address, formData.mode).error;
    if (addressError) errors.address = addressError;

    const cityError = validateCity(formData.city, formData.mode).error;
    if (cityError) errors.city = cityError;

    const stateError = validateState(formData.state, formData.mode).error;
    if (stateError) errors.state = stateError;

    const countryError = validateCountry(formData.country, formData.mode).error;
    if (countryError) errors.country = countryError;
  }

  const startDateError = validateStartDate(formData.startDate, formData.dateType).error;
  if (startDateError) errors.startDate = startDateError;

  const endDateError = validateEndDate(formData.endDate, formData.dateType, formData.startDate).error;
  if (endDateError) errors.endDate = endDateError;

  const maxVolunteersError = validateMaxVolunteers(formData.maxVolunteers).error;
  if (maxVolunteersError) errors.maxVolunteers = maxVolunteersError;

  const contactNameError = validateContactName(formData.contactName).error;
  if (contactNameError) errors.contactName = contactNameError;

  const contactEmailError = validateContactEmail(formData.contactEmail).error;
  if (contactEmailError) errors.contactEmail = contactEmailError;

  const contactPhoneError = validateContactPhone(formData.contactPhone).error;
  if (contactPhoneError) errors.contactPhone = contactPhoneError;

  if (formData.osrmLink) {
    const urlError = validateUrl(formData.osrmLink).error;
    if (urlError) errors.osrmLink = urlError;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
