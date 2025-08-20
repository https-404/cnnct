import { Router } from "express";
import { listFriends, removeFriend } from "../controllers/friend.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const friendRouter: Router = Router();

friendRouter.get("/", authenticateToken, listFriends);
friendRouter.delete("/:userId", authenticateToken, removeFriend);

export default friendRouter;
