import {
  TeamsActivityHandler,
  BotState,
  TurnContext,
} from "botbuilder";
import { inject } from "inversify";
import { container } from "./inversify.config";
import CacheService from './services/cacheService';

export let serviceUrl: string;

export class TeamsBot extends TeamsActivityHandler {
  constructor(
              private conversationState: BotState, 
              private userState: BotState) {
    super();
    if (!conversationState) {
      throw new Error("[TeamsBot]: Missing parameter. conversationState is required");
    }
    if (!userState) {
      throw new Error("[TeamsBot]: Missing parameter. userState is required");
    }

    this.onConversationUpdate(async (context, next) => {
      serviceUrl = context.activity.serviceUrl;
      const conversationId = context.activity.conversation.id;
      const meetingId = context.activity.channelData.meeting.id;
      // let conversationIds = this.cacheService.get('conversationIds') as { [meetingId: string]: string}
      // if (!conversationIds) {
      //   conversationIds = { }
      // }

      // conversationIds[meetingId] = conversationId
      // this.cacheService.put('conversationIds', conversationIds)
    })
  }

  async run(context: TurnContext) {
    await super.run(context);

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}
