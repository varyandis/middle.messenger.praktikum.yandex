export type ValidationResult = {
  isValid: boolean
  error: string | null
}

export function validateField(name: string, value: string): ValidationResult {
  switch (name) {
    case 'login':
      return validateLogin(value);

    case 'password':
      return validatePassword(value);

    default:
      return { isValid: true, error: null };
  }
}

function validateLogin(value: string): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Логин не может быть пустым',
    };
  }

  if (trimmed.length < 3 || trimmed.length > 20) {
    return {
      isValid: false,
      error: 'Логин должен быть от 3 до 20 символов',
    };
  }

  const allowedChars = /^[a-zA-Z0-9_-]+$/;
  if (!allowedChars.test(trimmed)) {
    return {
      isValid: false,
      error: 'Логин может содержать только латинские буквы, цифры, "-", "_"',
    };
  }

  const onlyDigits = /^\d+$/;
  if (onlyDigits.test(trimmed)) {
    return {
      isValid: false,
      error: 'Логин не может состоять только из цифр',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

function validatePassword(value: string): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Пароль не может быть пустым',
    };
  }

  if (trimmed.length < 8 || trimmed.length > 40) {
    return {
      isValid: false,
      error: 'Пароль должен быть от 8 до 40 символов',
    };
  }

  const hasUppercase = /[A-Z]/.test(trimmed);
  if (!hasUppercase) {
    return {
      isValid: false,
      error: 'Пароль должен содержать хотя бы одну заглавную букву',
    };
  }

  const hasDigit = /\d/.test(trimmed);
  if (!hasDigit) {
    return {
      isValid: false,
      error: 'Пароль должен содержать хотя бы одну цифру',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

