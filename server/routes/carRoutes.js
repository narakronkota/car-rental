import express from "express";
import { updateCarImageEndpoint } from "../controllers/carController.js";
import { protect } from "../middleware/auth.js";  // ถ้าอยากให้ต้อง login ก่อน

const router = express.Router();   // 👈 สำคัญมาก ต้องสร้าง router ก่อน

// PUT /api/cars/update-image
router.put("/update-image", protect, updateCarImageEndpoint);

export default router;
