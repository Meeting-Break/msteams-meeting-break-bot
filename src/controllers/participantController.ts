import { Response, NextFunction } from "express";
import { inject } from "inversify";
import { controller, httpGet, interfaces, response, next, requestParam } from "inversify-express-utils";
import ParticipantService from "../services/participantService";

@controller("/participant")
export class ParticipantController implements interfaces.Controller {
    constructor(@inject("ParticipantService") private participantService: ParticipantService) { }
    
    @httpGet("/")
    async getParticipant(@requestParam("meetingId") meetingId: string,
                         @requestParam("participantId") participantId: string,
                         @requestParam("tenantId") tenantId: string,
                         @response() res: Response, 
                         @next() next: NextFunction
                        )
    {
        try {
            const participantPayload = await this.participantService.getParticipant(meetingId, participantId, tenantId)
            res.send(participantPayload)
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
        return next()
    }
}