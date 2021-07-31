import { NextFunction, Request, Response  } from "express";
import { interfaces, controller, httpGet, request, response, next } from "inversify-express-utils";

@controller("/health")
export class HealthController implements interfaces.Controller {
    @httpGet("/")
    async getHealth(@request() _req: Request, @response() res: Response, @next() next: NextFunction) {
        res.sendStatus(200)
        return next();
    }
}