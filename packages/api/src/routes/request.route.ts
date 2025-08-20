import { Router } from "express";
import {
  listRequests,
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from "../controllers/request.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const requestRouter: Router = Router();

requestRouter.get("/", authenticateToken, listRequests);
requestRouter.post("/:userId", authenticateToken, sendRequest);
requestRouter.post("/:requestId/accept", authenticateToken, acceptRequest);
requestRouter.post("/:requestId/reject", authenticateToken, rejectRequest);
requestRouter.post("/:requestId/cancel", authenticateToken, cancelRequest);

export default requestRouter;
