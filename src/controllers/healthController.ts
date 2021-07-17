import { Request, Response, Next  } from "restify";
export class HealthController {
    async getHealth(_req: Request, res: Response, next: Next) {
        res.send(200, 'OK')
        return next()
    }
}