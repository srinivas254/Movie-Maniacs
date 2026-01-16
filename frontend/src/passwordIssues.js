
export function getPasswordIssues(password) {
  const issues = [];

  if (!/^[a-zA-Z]/.test(password))
    issues.push("Must start with a letter");

  if (/\s/.test(password))
    issues.push("Must not contain spaces");

  if (!/[a-z]/.test(password))
    issues.push("Add a lowercase letter");

  if (!/[A-Z]/.test(password))
    issues.push("Add an uppercase letter");

  if (!/[0-9]/.test(password))
    issues.push("Add a number");

  if (!/[!@#$%^&*]/.test(password))
    issues.push("Add a special character");

  if (password.length < 10)
    issues.push("Must be at least 10 characters");

  return issues;
}