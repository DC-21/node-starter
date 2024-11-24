import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import httpStatus from "http-status-codes";

export const validate =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(httpStatus.BAD_REQUEST).json(e.errors);
      } else {
        next(e);
      }
    }
  };
