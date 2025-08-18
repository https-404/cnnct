import { RequestHandler, Request, Response } from "express";
import { LoginDTO } from "../DTOs/login.dto";
import { RegisterDTO } from '../DTOs/register.dto';
import AuthService from '../services/auth.service';
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ApiResponse } from "../util/response.util";


export const login: RequestHandler = async  (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      ApiResponse(res, 200, 'Login successful', tokens);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized';
      ApiResponse(res, 401, message);
    }
  }

  export const register: RequestHandler = async  (req: Request, res: Response) => {
    try {
      const registerData = plainToClass(RegisterDTO, req.body);
      const errors = await validate(registerData);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }

      const tokens = await AuthService.register(registerData);
      ApiResponse(res, 201, 'Registration successful', tokens);
    } catch (error) {
      ApiResponse(res, 400, (error as Error).message);
    }
  }

  export const refresh: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshTokens(refreshToken);
      ApiResponse(res, 200, 'Tokens refreshed successfully', tokens);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized';
      ApiResponse(res, 401, message);
    }
  }




