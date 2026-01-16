
export function getPasswordStrength(password) {
  let score = 0;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const hasMinLength = password.length >= 10;
  const noSpaces = !/\s/.test(password);
  const startsWithLetter = /^[a-zA-Z]/.test(password);

  if(startsWithLetter) score++;
  if(hasLower && hasUpper) score++;
  if(hasNumber && hasSpecial) score++;
  if(hasMinLength && noSpaces) score++;
  if(password.length >= 13) score++;

  score = Math.min(score, 5);

  const levels = [
    null,
    { label: "Too Weak", textColor: "text-red-500" },
    { label: "Weak", textColor: "text-orange-500" },
    { label: "Fair", textColor: "text-yellow-500" },
    { label: "Good", textColor: "text-green-500" },
    { label: "Strong", textColor: "text-blue-700" },
  ];

  return {
    level: score,
    label: levels[score]?.label ?? "",
    textColor: levels[score]?.textColor ?? "",
    isValid:
      hasLower &&
      hasUpper &&
      hasNumber &&
      hasSpecial &&
      hasMinLength &&
      noSpaces &&
      startsWithLetter
  };
}