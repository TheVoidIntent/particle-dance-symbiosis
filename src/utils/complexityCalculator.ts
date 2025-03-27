
/**
 * Calculate the complexity of a particle based on its current complexity,
 * number of interactions, and age
 */
export const calculateComplexity = (
  currentComplexity: number,
  interactions: number,
  age: number
): number => {
  // Base growth from interactions
  const interactionGrowth = interactions * 0.001;
  
  // Small growth from age (diminishing returns)
  const ageGrowth = Math.log(age + 1) * 0.005;
  
  // Combine factors
  const newComplexity = currentComplexity + interactionGrowth + ageGrowth;
  
  // Cap complexity at a reasonable value
  return Math.min(100, newComplexity);
};
