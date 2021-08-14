import axios from "axios";
import { MicrosoftAppCredentials } from "botframework-connector";
import { injectable } from "inversify";
import { serviceUrl } from "../teamsBot";
import { ParticipantDetailsPayload } from "../types/payloads/participantDetailsPayload";
import { ParticipantDetailsResponse } from "../types/teams/participantDetailsResponse";

@injectable()
export default class ParticipantService {
  async getParticipant(
    meetingId: string,
    participantId: string,
    tenantId: string
  ): Promise<ParticipantDetailsPayload> {
    const credentials = new MicrosoftAppCredentials(
      process.env.BOT_ID,
      process.env.BOT_PASSWORD
    );
    const token = await credentials.getToken();
    const getParticipantDetailsRequest = await axios.get(
      `${serviceUrl}v1/meetings/${meetingId}/participants/${participantId}?tenantId=${tenantId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const getParticipantDetailsData =
      getParticipantDetailsRequest.data as ParticipantDetailsResponse;
    const payload: ParticipantDetailsPayload = {
      user: {
        name: getParticipantDetailsData.user.name,
      },
      meeting: {
        role: getParticipantDetailsData.meeting.role,
      },
    };

    return payload;
  }
}
