import cors from "cors";
import helmet from "helmet";
import bodyParser = require("body-parser");
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "./inversify.config";
const compression = require("compression");

let inversifyServer = new InversifyExpressServer(container, null, {
  rootPath: "/api",
});
inversifyServer.setConfig((app) => {
  app.options("*", cors());
  app.use(compression());
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json({ limit: "1mb" }));
  app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
  app.use((error, req, res, next) => {
    res.json({
      message: error.message,
    });
  });
});

export const app = inversifyServer.build();
