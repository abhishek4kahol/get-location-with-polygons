import { Router } from "express";
import userRouter from "./api/user";

// Init router
const router: Router = Router();

// Add sub-routes
router.use("/outlet", userRouter);

// Export the base-router
export default router;
