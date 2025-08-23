import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  DeleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAcailability,
  updateUserImage

} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);

// ✅ protect ก่อน upload เพื่อเช็ก token ก่อนรับไฟล์
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);

ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAcailability);
ownerRouter.post("/delete-car", protect, DeleteCar);
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post("/update-image", protect, upload.single("image"), updateUserImage);


export default ownerRouter;
