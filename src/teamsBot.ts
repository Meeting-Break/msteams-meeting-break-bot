import {
  TeamsActivityHandler,
  BotState,
  TurnContext,
} from "botbuilder";

export let serviceUrl: string;

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
    
    this.onMessage(async (context, next) => {
      console.log("Running dialog with Message Activity.");
      console.log(context.activity.serviceUrl);
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onConversationUpdate(async (context, next) => {
      console.log("hello from onConversationUpdate")
      serviceUrl = context.activity.serviceUrl;
      console.log(serviceUrl)
    })
  }

  async run(context: TurnContext) {
    await super.run(context);

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}
