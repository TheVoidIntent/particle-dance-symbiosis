
let idCounter = 0;

export const generateUniqueId = (): string => {
  return `particle-${Date.now()}-${idCounter++}`;
};
