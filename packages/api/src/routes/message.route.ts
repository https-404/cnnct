import { Router } from "express";
import { getMessages, deleteMessage } from "../controllers/message.controller";
import { uploadMessageAttachmentController } from "../controllers/message-attachment.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import multer from "multer";

const messageRouter: Router = Router();

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit for message attachments
  },
});

messageRouter.get("/:userId", authenticateToken, getMessages);
messageRouter.delete("/:messageId", authenticateToken, deleteMessage);
messageRouter.post(
  "/attachment",
  authenticateToken,
  uploadFile.single("attachment"),
  uploadMessageAttachmentController
);

export default messageRouter;
