export const extractInfo = (message, regex) => {
  const match = message.match(regex);
  if (match) {
    for (let i = 1; i < match.length; i++) {
      if (match[i]) {
        return match[i].trim();
      }
    }
  }
  return null;
};