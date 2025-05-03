import express from "express";
import {getDashboardStats,deleteUser,addEmployee,deleteProperty,deleteFeedback} from "../controllers/AdminController.js";
import { verifyJWT, roleCheck } from "../middlewares/auth.js";

const router = express.Router();

router.get("/dashboard-stats",verifyJWT,roleCheck(["admin"]),getDashboardStats);
router.delete("/users/:id", verifyJWT, roleCheck(["admin"]), deleteUser);
router.delete("/feedback/:id", verifyJWT, roleCheck(["admin"]), deleteFeedback);
router.post("/add-employee", verifyJWT, roleCheck(["admin"]), addEmployee);
router.delete("/properties/:id",verifyJWT,roleCheck(["admin"]),deleteProperty);

export default router;
