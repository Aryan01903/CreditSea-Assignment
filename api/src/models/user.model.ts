import bcrypt from "bcryptjs";
import { Document, Schema, model } from "mongoose";
import { EMPLOYMENT_MODES, EmploymentMode, ROLES, Role } from "../constants";

export interface PersonalDetails {
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  personalDetails?: PersonalDetails;
  salarySlip?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const personalDetailsSchema = new Schema<PersonalDetails>(
  {
    fullName: { type: String, required: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    employmentMode: { type: String, enum: EMPLOYMENT_MODES, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.BORROWER },
    personalDetails: { type: personalDetailsSchema },
    salarySlip: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<UserDocument>("User", userSchema);
