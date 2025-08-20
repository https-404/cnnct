import { Router } from "express";
import { uploadProfilePictureController, getCurrentUserController, updateCurrentUserController } from "../controllers/user.controller";
import multer from "multer";

const userRouter: Router = Router();
userRouter.get("/me", getCurrentUserController);
userRouter.patch("/me", updateCurrentUserController);

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
