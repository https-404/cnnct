import  { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { LoginDTO } from "../DTOs/login.dto";
import { validateBody } from "../middleware/validate.middleware";



const authRouter: Router = Router();

authRouter.post('/login', validateBody(LoginDTO), login);
authRouter.post("/register", register);

export default authRouter;