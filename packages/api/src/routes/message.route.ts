import { Router } from "express";
import { getMessages, deleteMessage } from "../controllers/message.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const messageRouter: Router = Router();

messageRouter.get("/:userId", authenticateToken, getMessages);
messageRouter.delete("/:messageId", authenticateToken, deleteMessage);

export default messageRouter;
