import { Container } from "inversify";
import BreakJobManager from "./managers/breakJobManager";
import BreakService from "./services/breakService";
import CacheService from "./services/cacheService";
import ParticipantService from "./services/participantService";
import "./controllers/participantController";
import "./controllers/healthController";
import "./controllers/breakController";

let container = new Container();
container.bind<ParticipantService>("ParticipantService").to(ParticipantService);
container.bind<BreakService>("BreakService").to(BreakService);
container.bind<CacheService>("CacheService").to(CacheService);
container
  .bind<BreakJobManager>("BreakJobManager")
  .to(BreakJobManager)
  .inSingletonScope();

export { container };
