export const checkDomain = (inputValue: string): boolean => {
  if (!inputValue || inputValue.trim().length === 0) {
    return false;
  }

  const hasInvalidChars = /[^a-zA-Z0-9-.]/g.test(inputValue);
  if (hasInvalidChars) {
    return false;
  }

  const domainParts = inputValue.split(".");

  if (domainParts.length < 2) {
    return false;
  }

  for (const part of domainParts) {
    if (part.length === 0) {
      return false;
    }

    if (part.startsWith("-") || part.endsWith("-")) {
      return false;
    }
  }

  return true;
};
