# Meeting Break API / Bot

Meeting Break API / Bot is used by the Meeting Break application to handle meeting break functionality. The bot is required to get a context while the meeting is in progress which allows us to make requests to meeting API as documented [here](https://docs.microsoft.com/en-us/microsoftteams/platform/apps-in-teams-meetings/create-apps-for-teams-meetings?tabs=dotnet).

# Developing
1. `npm install`
2. `npm watch`
3. `npm start:ngrok`
4. The previous two commands will allow you to watch for changes in the API and also start a tunnel using ngrok. This URL must be provided as the API messages endpoint on the Azure resource of the bot.
5. `npm run build:teams:dev`
6. Take the output from the command above and install the package into teams. This will need to be done everytime the bot/API is refreshed.