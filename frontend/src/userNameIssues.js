
export function getUsernameIssues(userName) {
  const issues = [];

  if (!/^[a-z]/.test(userName))
    issues.push("Must start with a lowercase letter");

  if (userName.length < 10)
    issues.push("Must be at least 10 characters");

  if (userName.includes("@"))
    issues.push("Must not contain '@'");

  return issues;
}
