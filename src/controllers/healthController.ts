import { NextFunction, Request, Response  } from "express";
export class HealthController {
    async getHealth(_req: Request, res: Response, next: NextFunction) {
        res.send('OK')
        return next();
    }
}