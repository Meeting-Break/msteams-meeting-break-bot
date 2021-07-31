import * as cors from "cors";
import * as helmet from  "helmet";
import {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
  UserState,
  TurnContext,
} from "botbuilder";
import { Container } from 'inversify';
import "reflect-metadata"
import { InversifyExpressServer } from 'inversify-express-utils';
import { config } from 'dotenv'
import { TeamsBot } from "./teamsBot";
import { MeetingBreakController } from "./controllers/meetingBreakController";
import "./controllers/healthController";
const compression = require('compression')
const path = require('path');
const bodyParser = require('body-parser');
const ENV_FILE = path.join(__dirname, '.env')
config({ path: ENV_FILE })

if (process.env.NODE_ENV === 'production') {
  let appInsights = require('applicationinsights');
  appInsights.setup().start()
}

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
  appId: process.env.BOT_ID,
  appPassword: process.env.BOT_PASSWORD,
});
// Catch-all for errors.
const onTurnErrorHandler = async (context: TurnContext, error: Error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    "OnTurnError Trace",
    `${error}`,
    "https://www.botframework.com/schemas/error",
    "TurnError"
  );

  // Send a message to the user
  await context.sendActivity(`The bot encountered unhandled error:\n ${error.message}`);
  await context.sendActivity("To continue to run this bot, please fix the bot source code.");
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Define the state store for your bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new MemoryStorage();

// Create conversation and user state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create the bot that will handle incoming messages.
const bot = new TeamsBot(conversationState, userState);

// Create HTTP server.
let container = new Container()

let inversifyServer = new InversifyExpressServer(container, null, { rootPath: "/api" })
inversifyServer.setConfig((app) => {
  app.options('*', cors())
  app.use(compression())
  app.use(helmet())
  app.use(cors())
  app.use(bodyParser.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }))
  app.use((error, req, res, next) => {
    res.json({
      message: error.message
    });
  });
})

const app = inversifyServer.build()
const server = app.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started`);
});

// Listen for incoming requests.
app.post("/api/messages", async (req, res) => {
  await adapter
    .processActivity(req, res, async (context) => {
      await bot.run(context);
    })
});

const meetingBreakController = new MeetingBreakController()
app.post("/api/setBreakDetails", meetingBreakController.setBreakDetails)
app.post("/api/sendParticipantDetails", meetingBreakController.getParticipantDetails)
app.get("/api/getBreakDetails", meetingBreakController.getBreakDetails)

process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})