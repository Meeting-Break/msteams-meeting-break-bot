
import { MicrosoftAppCredentials } from "botframework-connector";
import { NextFunction, Request, Response } from 'express';
import axios from "axios";

import { serviceUrl } from '../teamsBot';
import { ParticipantDetailsPayload } from "../types/payloads/participantDetailsPayload";
import { ParticipantDetailsResponse } from "../types/teams/participantDetailsResponse";
import { SetBreakDetailsInput } from "../types/inputs/setBreakDetailsInput";
import { GetBreakDetailsPayload } from "../types/payloads/getBreakDetailsPayload";
import createContainerClient from "../factories/blobStorageFactory";
import { streamToString } from "../utilities/parsingUtils";
import breakJobManager = require("../managers/breakJobManager");
import cacheService = require("../services/cacheService");

export class MeetingBreakController {
    async getParticipantDetails(req: Request, res: Response, next: NextFunction)
    {
        try {
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
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
        
        return next()
    }

    async setBreakDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const breakDetails = req.body as SetBreakDetailsInput
            if (breakDetails.cancelled) {
                breakJobManager.default.stop(breakDetails.meeting.id.value)
            }
            const breakDetailsJson = JSON.stringify(breakDetails)
            const containerClient = createContainerClient()
            const blockBlobContainer = containerClient.getBlockBlobClient(`${breakDetails.meeting.id.value}.json`)
            const isNewBreak = (start: Date, duration: { minutes: number, seconds: number }) => {
                const totalSeconds = (duration.minutes * 60) + duration.seconds
                const currentTime = new Date()
                return ((start.getTime() / 1000) + totalSeconds) > (currentTime.getTime() / 1000)
            }

            if (!breakDetails.cancelled && (!(await blockBlobContainer.exists()) || isNewBreak(new Date(breakDetails.start), breakDetails.duration))) {
                breakJobManager.default.start(breakDetails)
            }
            await blockBlobContainer.upload(breakDetailsJson, breakDetailsJson.length)
            cacheService.default.put(breakDetails.meeting.id.value, breakDetails, (breakDetails.duration.minutes * 60) + breakDetails.duration.seconds)
            res.sendStatus(200)
        } catch (e) {
            console.error(e)
            res.sendStatus(500);
        }

        return next()
    }

    async getBreakDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const meetingId = req.query.meetingId as string;
            const cachedBreakDetails = cacheService.default.get(meetingId) as GetBreakDetailsPayload
            if (cachedBreakDetails) {
                res.send(cachedBreakDetails)
                return next()
            }

            const blobContainer = createContainerClient().getBlockBlobClient(`${meetingId}.json`)
            const data = (await streamToString((await blobContainer.download()).readableStreamBody))
            const breakDetails = JSON.parse(data) as GetBreakDetailsPayload
            res.send(breakDetails)
        } catch(e) {
            console.error(e)
            res.send(undefined)
        }

        return next();
    }
}