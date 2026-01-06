export function validatePassword(password) {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);

  return {
    isValid,
    requirements,
    strength: calculateStrength(requirements),
  };
}

function calculateStrength(requirements) {
  const passed = Object.values(requirements).filter(Boolean).length;

  if (passed === 5) return 'strong';
  if (passed >= 3) return 'medium';
  return 'weak';
}

export function getPasswordStrengthColor(strength) {
  switch (strength) {
    case 'strong':
      return '#00d2d3'; // cyan
    case 'medium':
      return '#ffa502'; // orange
    case 'weak':
      return '#ff4757'; // red
    default:
      return '#666';
  }
}

export function getPasswordRequirementText() {
  return [
    { key: 'minLength', text: 'At least 8 characters' },
    { key: 'hasUpperCase', text: 'One uppercase letter (A-Z)' },
    { key: 'hasLowerCase', text: 'One lowercase letter (a-z)' },
    { key: 'hasNumber', text: 'One number (0-9)' },
    { key: 'hasSpecialChar', text: 'One special character (!@#$%^&*)' },
  ];
}
