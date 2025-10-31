
import  { Router } from "express";
import { login, register, logout, refresh } from "../controllers/auth.controller";
import { LoginDTO } from "../DTOs/login.dto";
import { validateBody } from "../middleware/validate.middleware";



const authRouter: Router = Router();
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);
authRouter.post('/login', validateBody(LoginDTO), login);
authRouter.post("/register", register);

export default authRouter;