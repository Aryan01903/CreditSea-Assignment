import { BRE_LIMITS, PAN_REGEX } from "../constants";
import { PersonalDetails } from "../models/user.model";

export interface BreFailure {
  rule: string;
  message: string;
}

const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) age--;
  return age;
};

export const runBre = (details: PersonalDetails): BreFailure[] => {
  const failures: BreFailure[] = [];
  const age = calculateAge(details.dateOfBirth);

  if (age < BRE_LIMITS.MIN_AGE || age > BRE_LIMITS.MAX_AGE) {
    failures.push({
      rule: "age",
      message: `Applicant age must be between ${BRE_LIMITS.MIN_AGE} and ${BRE_LIMITS.MAX_AGE} years (yours is ${age})`,
    });
  }

  if (details.monthlySalary < BRE_LIMITS.MIN_SALARY) {
    failures.push({
      rule: "salary",
      message: `Monthly salary must be at least ₹${BRE_LIMITS.MIN_SALARY.toLocaleString("en-IN")}`,
    });
  }

  if (!PAN_REGEX.test(details.pan)) {
    failures.push({
      rule: "pan",
      message: "PAN must match the format AAAAA9999A",
    });
  }

  if (details.employmentMode === "unemployed") {
    failures.push({
      rule: "employment",
      message: "Unemployed applicants are not eligible for a loan",
    });
  }

  return failures;
};
