import { Router } from "express";
import {
  applyForLoan,
  getMyLoans,
  savePersonalDetails,
  uploadSlip,
} from "../controllers/borrower.controller";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { uploadSalarySlip } from "../middlewares/upload";
import { ROLES } from "../constants";

const router = Router();

router.use(authenticate, authorize(ROLES.BORROWER));

router.put("/personal-details", savePersonalDetails);
router.post("/salary-slip", uploadSalarySlip, uploadSlip);
router.post("/loans", applyForLoan);
router.get("/loans", getMyLoans);

export default router;
