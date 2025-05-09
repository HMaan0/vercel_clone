export const checkDomain = (inputValue: string): boolean => {
  if (!inputValue || inputValue.trim().length === 0) {
    return false;
  }

  const hasInvalidChars = /[^a-zA-Z0-9-]/g.test(inputValue);
  if (hasInvalidChars) {
    return false;
  }

  if (inputValue.startsWith("-") || inputValue.endsWith("-")) {
    return false;
  }

  return true;
};
