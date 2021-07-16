
import { MicrosoftAppCredentials } from "botframework-connector";
import { Request } from 'restify';
import { serviceUrl } from '../teamsBot';
import axios from "axios";
import { MeetingDetailsResponse } from "../types/meetingDetailsResponse";

export class MeetingBreakController {
    async getMeetingDetails(req: Request): Promise<MeetingDetailsResponse>
    {
        const credentials = new MicrosoftAppCredentials(
            process.env.BOT_ID,
            process.env.BOT_PASSWORD
        )

        const meetingId = req.body?.meetingId;
        const token = await credentials.getToken();
        const getMeetingDetailsRequest = await axios.get(`${serviceUrl}/v1/meetings/${meetingId}`, {
            headers: {
                'Authorization': "Bearer " + token
            }
        })
        const response = getMeetingDetailsRequest.data as MeetingDetailsResponse
        return response;
    }
}