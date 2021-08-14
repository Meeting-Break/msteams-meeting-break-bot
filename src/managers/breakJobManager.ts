import axios from "axios";
import { MicrosoftAppCredentials } from "botframework-connector";
import { inject, injectable } from "inversify";
import CacheService from "../services/cacheService";
import { serviceUrl } from "../teamsBot";
import { CreateBreakDetailsInput } from "../types/inputs/createBreakDetailsInput";

@injectable()
export default class BreakJobManager {
  private timers: {
    [meetingId: string]: { remainingDuration: number; timer: NodeJS.Timer };
  } = {};

  constructor(@inject("CacheService") private cacheService: CacheService) {}

  start(breakDetails: CreateBreakDetailsInput) {
    const meetingId = breakDetails.meeting.id.value;
    this.timers[meetingId] = {
      remainingDuration:
        breakDetails.duration.minutes * 60 + breakDetails.duration.seconds,
      timer: undefined,
    };

    const timer = setInterval(async () => {
      this.timers[meetingId].remainingDuration -= 1;
      if (this.timers[meetingId].remainingDuration === 0) {
        const conversationIds = this.cacheService.get("conversationIds") as {
          [meetingId: string]: string;
        };
        if (!(meetingId in conversationIds)) {
          console.error(
            `meetingId ${meetingId} does not have a conversationId.`
          );
          return;
        }

        const conversationId = conversationIds[meetingId];
        await this.sendEndOfBreakNotification(conversationId);
        this.stop(meetingId);
      }
    }, 1000);
    this.timers[meetingId].timer = timer;
  }

  stop(meetingId: string) {
    if (meetingId in this.timers) {
      clearInterval(this.timers[meetingId].timer);
      delete this.timers[meetingId];
    }
  }

  private async sendEndOfBreakNotification(conversationId: string) {
    const credentials = new MicrosoftAppCredentials(
      process.env.BOT_ID,
      process.env.BOT_PASSWORD
    );

    const token = await credentials.getToken();
    await axios.post(
      `${serviceUrl}v3/conversations/${conversationId}/activities`,
      {
        type: "message",
        text: "The meeting break has ended.",
        summary: "Return to the meeting.",
        speak: "The meeting break has ended.",
        importance: "high",
        delivery: "notification",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  }
}
