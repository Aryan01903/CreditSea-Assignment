export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string | Date): string =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const computeInterest = (amount: number, tenureDays: number, rate: number) => {
  const interest = Math.round(((amount * rate * tenureDays) / (365 * 100)) * 100) / 100;
  return { interest, totalRepayment: Math.round((amount + interest) * 100) / 100 };
};
