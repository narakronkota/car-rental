import express from "express";
import {  deletePendingBookings, getCars, getUserData, loginUser, registerUser, updateOldCarNames } from "../controllers/UsserController.js";
import { protect } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/data',protect, getUserData)
userRouter.get('/cars',getCars)
userRouter.delete("/delete-pending" ,deletePendingBookings)
userRouter.post('/update-name' , updateOldCarNames)
export default userRouter;