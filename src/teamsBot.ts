import {
  TeamsActivityHandler,
  BotState,
  TurnContext,
} from "botbuilder";

export let serviceUrl: string;
export let conversationId: string;

export class TeamsBot extends TeamsActivityHandler {
  conversationState: BotState;
  userState: BotState;
  
  constructor(conversationState: BotState, userState: BotState) {
    super();
    if (!conversationState) {
      throw new Error("[TeamsBot]: Missing parameter. conversationState is required");
    }
    if (!userState) {
      throw new Error("[TeamsBot]: Missing parameter. userState is required");
    }
    this.conversationState = conversationState;
    this.userState = userState;

    this.onConversationUpdate(async (context, next) => {
      serviceUrl = context.activity.serviceUrl;
      conversationId = context.activity.conversation.id;
      console.log(`serviceUrl=${serviceUrl}`)
      console.log(`conversationId=${conversationId}`)
    })
  }

  async run(context: TurnContext) {
    await super.run(context);

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}
