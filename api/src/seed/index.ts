import mongoose from "mongoose";
import { connectDb } from "../config/db";
import { ROLES } from "../constants";
import { User } from "../models/user.model";

const accounts = [
  { name: "Admin User", email: "admin@lms.com", password: "Admin@123", role: ROLES.ADMIN },
  { name: "Sales Executive", email: "sales@lms.com", password: "Sales@123", role: ROLES.SALES },
  {
    name: "Sanction Executive",
    email: "sanction@lms.com",
    password: "Sanction@123",
    role: ROLES.SANCTION,
  },
  {
    name: "Disbursement Executive",
    email: "disbursement@lms.com",
    password: "Disburse@123",
    role: ROLES.DISBURSEMENT,
  },
  {
    name: "Collection Executive",
    email: "collection@lms.com",
    password: "Collect@123",
    role: ROLES.COLLECTION,
  },
  {
    name: "Demo Borrower",
    email: "borrower@lms.com",
    password: "Borrower@123",
    role: ROLES.BORROWER,
  },
];

const seed = async (): Promise<void> => {
  await connectDb();

  for (const account of accounts) {
    const existing = await User.findOne({ email: account.email });
    if (existing) {
      console.log(`Skipped ${account.email} (already exists)`);
      continue;
    }
    await User.create(account);
    console.log(`Created ${account.role} account: ${account.email} / ${account.password}`);
  }

  await mongoose.disconnect();
  console.log("Seeding complete");
};

seed().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});
