import { Document, Schema, Types, model } from "mongoose";

export interface PaymentDocument extends Document {
  loan: Types.ObjectId;
  utr: string;
  amount: number;
  paidAt: Date;
  recordedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    loan: { type: Schema.Types.ObjectId, ref: "Loan", required: true, index: true },
    utr: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    paidAt: { type: Date, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Payment = model<PaymentDocument>("Payment", paymentSchema);
