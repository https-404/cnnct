import { Router } from "express";
import { uploadProfilePictureController, getCurrentUserController, updateCurrentUserController, searchUsersController } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import multer from "multer";

const userRouter: Router = Router();
userRouter.get("/me", authenticateToken, getCurrentUserController);
userRouter.patch("/me", authenticateToken, updateCurrentUserController);
userRouter.get("/search", authenticateToken, searchUsersController);

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

userRouter.post(
  "/profile-picture",
  authenticateToken,
  uploadFile.single("profilePicture"),
  uploadProfilePictureController
);

export default userRouter;
