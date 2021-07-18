
import { MicrosoftAppCredentials } from "botframework-connector";
import { NextFunction, Request, Response } from 'express';
import { serviceUrl, conversationId } from '../teamsBot';
import axios from "axios";
import { ParticipantDetailsPayload } from "../types/payloads/participantDetailsPayload";
import { ParticipantDetailsResponse } from "../types/teams/participantDetailsResponse";
import { SetBreakDetailsInput } from "../types/inputs/setBreakDetailsInput";
import { GetBreakDetailsPayload } from "../types/payloads/getBreakDetailsPayload";
import createContainerClient from "../factories/blobStorageFactory";
import { streamToString } from "../utilities/parsingUtils";

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

    async setBreakDetails(req: Request, res: Response, next: NextFunction) {
        const breakDetails = req.body as SetBreakDetailsInput
        const breakDetailsJson = JSON.stringify(breakDetails)
        const blockBlobContainer = createContainerClient().getBlockBlobClient(`${breakDetails.meeting.id.value}.json`)
        await blockBlobContainer.upload(breakDetailsJson, breakDetailsJson.length)
        res.sendStatus(200)
        return next()
    }

    async getBreakDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const meetingId = req.query.meetingId;
            const blobContainer = createContainerClient().getBlockBlobClient(`${meetingId}.json`)
            const data = (await streamToString((await blobContainer.download()).readableStreamBody))
            const breakDetails = JSON.parse(data) as GetBreakDetailsPayload
            res.send(breakDetails)
        } catch(e) {
            res.send(undefined)
        }

        return next();
    }

    async sendEndOfBreakNotification(req: Request, res: Response, next: NextFunction) {
        const credentials = new MicrosoftAppCredentials(
            process.env.BOT_ID,
            process.env.BOT_PASSWORD
        )

        const token = await credentials.getToken();
        const sendNotificationSignalRequest = await axios.post(`${serviceUrl}v3/conversations/${conversationId}/activities`, 
        {
            "type": "message",
            "text": "The meeting break has ended.",
            "summary": "Return to the meeting."
        }, 
        {
            headers: {
                'Authorization': "Bearer " + token
            }
        })
        res.sendStatus(sendNotificationSignalRequest.status)
        return next()
    }
}