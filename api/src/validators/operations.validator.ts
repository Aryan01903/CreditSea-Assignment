import { z } from "zod";

export const sanctionDecisionSchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("approve") }),
  z.object({
    decision: z.literal("reject"),
    reason: z.string().trim().min(3, "Rejection reason is required"),
  }),
]);

export const recordPaymentSchema = z.object({
  utr: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{8,22}$/, "UTR must be 8-22 alphanumeric characters"),
  amount: z.coerce.number().positive("Payment amount must be positive"),
  paidAt: z.coerce.date().max(new Date(), "Payment date cannot be in the future"),
});
