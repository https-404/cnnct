import { healthCheck } from "../controllers/health.controller";
import { Router } from "express";
const healthrouter: Router = Router();




healthrouter.get("/", healthCheck);

export default healthrouter;