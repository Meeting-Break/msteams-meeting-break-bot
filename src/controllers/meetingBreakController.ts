
import { MicrosoftAppCredentials } from "botframework-connector";
import { NextFunction, Request, Response } from 'express';
import { serviceUrl } from '../teamsBot';
import axios from "axios";
import { ParticipantDetailsPayload } from "../types/payloads/participantDetailsResponse";
import { ParticipantDetailsResponse } from "../types/teams/participantDetailsResponse";
export class MeetingBreakController {
    async getParticipantDetails(req: Request, res: Response, next: NextFunction)
    {
        const credentials = new MicrosoftAppCredentials(
            process.env.BOT_ID,
            process.env.BOT_PASSWORD
        )
        const meetingId = req.body?.meetingId;
        const participantId = req.body?.participantId;
        const tenantId = req.body?.tenantId;

        const token = await credentials.getToken();
        const getParticipantDetailsRequest = await axios.get(`${serviceUrl}v1/meetings/${meetingId}/participants/${participantId}?tenantId=${tenantId}`, {
            headers: {
                'Authorization': "Bearer " + token
            }
        })
        const getParticipantDetailsData = getParticipantDetailsRequest.data as ParticipantDetailsResponse
        const payload: ParticipantDetailsPayload = {
            user: {
                name: getParticipantDetailsData.user.name
            },
            meeting: {
                role: getParticipantDetailsData.meeting.role
            }
        }
        res.send(payload)
        return next()
    }
}