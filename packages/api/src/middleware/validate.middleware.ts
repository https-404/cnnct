import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateBody = <T extends object>(cls: new () => T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(cls, req.body, { enableImplicitConversion: true });
    const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length) {
      return res.status(422).json({
        responseCode: 422,
        message: 'Validation failed',
        data: errors.map(e => ({ field: e.property, errors: e.constraints }))
      });
    }
    req.body = instance; 
    next();
  };
