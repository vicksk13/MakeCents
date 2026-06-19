// Recommendation Engine Hook
// Analyzes claimed vs unclaimed reliefs and generates personalized recommendations

export const useRecommendationEngine = (REL, ya, itemTotalRaw, allItems) => {
  // Calculate potential tax savings for a relief amount
  const calculateSavings = (amount) => {
    // Malaysian tax brackets - simplified at average marginal rate
    const estimatedMarginalRate = 0.20; // 20% average
    return Math.round(amount * estimatedMarginalRate);
  };

  // Score each relief based on multiple factors
  const scoreRelief = (item) => {
    const claimed = itemTotalRaw(item.id);
    const cap = item.cap;

    if (claimed >= cap) return 0; // Already fully claimed
    if (cap >= 999999) return 0; // Rental deductions, skip

    const unclaimedAmount = cap - claimed;
    const unclaimedPercentage = unclaimedAmount / cap;
    const potentialSavings = calculateSavings(unclaimedAmount);

    // Scoring factors:
    // 1. Unclaimed cap percentage (40%) - how much room is left
    // 2. Potential tax savings (35%) - RM value
    // 3. New/favorable reliefs (25%) - VMY, G21 CCTV, G12 childcare are good 2026 items

    const easeScore = {
      "VMY": 0.9,    // New relief, easy to claim
      "G21": 0.85,   // New CCTV option
      "G10": 0.8,    // Sports fitness, popular
      "G9": 0.85,    // Books/gadgets
      "G12": 0.9,    // Childcare, objective
      "G16c": 0.85,  // Disabled child relief
      "G4": 0.75,    // Requires documentation
      "G6": 0.7,     // Medical, requires receipts
      "G2": 0.75,    // Parents medical
    }[item.id] || 0.6;

    const score =
      (unclaimedPercentage * 0.40) +
      (Math.min(potentialSavings / 5000, 1) * 0.35) + // Normalize to 5k savings = max score
      (easeScore * 0.25);

    return {
      reliefId: item.id,
      reliefName: item.name,
      reliefNameBM: item.nameBM,
      cap,
      claimed,
      unclaimedAmount,
      potentialSavings,
      score: Math.round(score * 100) / 100,
      reason: generateReason(item.id, unclaimedPercentage, potentialSavings),
      isNew: ["VMY", "G21"].includes(item.id),
    };
  };

  // Generate explanation for why this relief is recommended
  const generateReason = (reliefId, unclaimedPct, savings) => {
    const reasons = {
      "VMY": `NEW for 2026: Domestic tourism relief - RM${savings} potential savings`,
      "G21": `NEW for 2026: CCTV & green tech relief - RM${savings} potential savings`,
      "G12": `Childcare permanently increased to RM3,000 - RM${savings} potential savings`,
      "G10": `Sports & fitness relief often overlooked - RM${savings} potential savings`,
      "G9": `Books & gadgets relief with high cap - RM${savings} potential savings`,
      "G6": `Medical relief with RM10,000 cap - RM${savings} potential savings available`,
      "G2": `Parents medical expenses frequently unclaimed - RM${savings} potential savings`,
      "G4": `Disabled individual relief increased for 2026 - RM${savings} potential savings`,
      "G16c": `Disabled child relief increased to RM10,000 - RM${savings} potential savings`,
    };
    return reasons[reliefId] || `Unclaimed relief with RM${savings} potential savings`;
  };

  // Generate recommendations
  const generateRecommendations = () => {
    if (!allItems || allItems.length === 0) return [];

    const scores = allItems
      .filter(item => item.cap < 999999) // Exclude rental deductions
      .map(item => scoreRelief(item))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 recommendations

    return scores;
  };

  return {
    generateRecommendations,
    calculateSavings,
  };
};
