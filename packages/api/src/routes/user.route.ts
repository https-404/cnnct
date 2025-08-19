import { Router } from "express";
import { uploadProfilePictureController } from "../controllers/user.controller";
import multer from "multer";

const userRouter: Router = Router();

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

userRouter.post(
  "/profile-picture",
  uploadFile.single("profilePicture"),
  uploadProfilePictureController
);

export default userRouter;
