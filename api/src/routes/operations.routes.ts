import { Router } from "express";
import {
  decideLoan,
  disburseLoan,
  getActiveLoans,
  getAppliedLoans,
  getLeads,
  getLoanPayments,
  getSanctionedLoans,
  recordPayment,
} from "../controllers/operations.controller";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { ROLES } from "../constants";

const router = Router();

router.use(authenticate);

router.get("/sales/leads", authorize(ROLES.SALES), getLeads);

router.get("/sanction/loans", authorize(ROLES.SANCTION), getAppliedLoans);
router.patch("/sanction/loans/:id", authorize(ROLES.SANCTION), decideLoan);

router.get("/disbursement/loans", authorize(ROLES.DISBURSEMENT), getSanctionedLoans);
router.patch("/disbursement/loans/:id/disburse", authorize(ROLES.DISBURSEMENT), disburseLoan);

router.get("/collection/loans", authorize(ROLES.COLLECTION), getActiveLoans);
router.get("/collection/loans/:id/payments", authorize(ROLES.COLLECTION), getLoanPayments);
router.post("/collection/loans/:id/payments", authorize(ROLES.COLLECTION), recordPayment);

export default router;
