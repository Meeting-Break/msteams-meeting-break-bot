import { controller, interfaces, response, next, httpGet, requestParam, httpPost, request, httpPatch } from "inversify-express-utils";
import { inject } from "inversify";
import BreakService from "../services/breakService";
import { NextFunction, Request, Response } from "express";

@controller("/break")
export class BreakController implements interfaces.Controller {
    constructor( @inject("BreakService") private breakService: BreakService ) { }
    
    @httpGet("/")
    async getBreak(@requestParam("meetingId") meetingId: string,
                   @response() res: Response, 
                   @next() next: NextFunction) 
    {
        try {
            const breakDetails = await this.breakService.getBreak(meetingId)
            res.send(breakDetails)
        } catch(e) {
            console.error(e)
            res.send(undefined)
        }

        return next();
    }

    @httpPatch("/")
    async updateBreak(@request() req: Request,
                      @response() res: Response,
                      @next() next: NextFunction) 
    {
        try {
            await this.breakService.updateBreak(req.body)
            res.sendStatus(200)
        } catch(e) {
            console.error(e)
            res.sendStatus(500)
        }

        return next()
    }

    @httpPost("/")
    async createBreak(@request() req: Request, 
                      @response() res: Response, 
                      @next() next: NextFunction) 
    {
        try {
            await this.breakService.createBreak(req.body)
            res.sendStatus(200)
        } catch (e) {
            console.error(e)
            res.sendStatus(500);
        }

        return next()
    }
}