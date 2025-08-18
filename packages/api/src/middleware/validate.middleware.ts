import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateBody = (Dto: new () => any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(Dto, req.body, { enableImplicitConversion: true });
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length) {
      return res.status(422).json({
        responseCode: 422,
        message: 'Validation failed',
        data: errors.map(e => ({
          field: e.property,
          errors: e.constraints
        }))
      });
    }
    req.body = dto; // validated & transformed
    next();
  };