import { materialRates } from "./materialRates";

export const calculateCoins = (material, weight) => {
  const rate = materialRates[material];
  if (!rate) return 0;

  return (weight / 1000) * rate;
};
