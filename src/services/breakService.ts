import { inject, injectable } from "inversify";
import createContainerClient from "../factories/blobStorageFactory";
import BreakJobManager from "../managers/breakJobManager";
import { CreateBreakDetailsInput } from "../types/inputs/createBreakDetailsInput";
import { UpdateBreakDetailsInput } from "../types/inputs/updateBreakDetailsInput";
import { GetBreakDetailsPayload } from "../types/payloads/getBreakDetailsPayload";
import { streamToString } from "../utilities/parsingUtils";
import CacheService from "./cacheService";

@injectable()
export default class BreakService {
  constructor(
    @inject("CacheService") private cacheService: CacheService,
    @inject("BreakJobManager") private breakJobManager: BreakJobManager
  ) {}

  async createBreak(breakDetails: CreateBreakDetailsInput) {
    const breakDetailsJson = JSON.stringify(breakDetails);
    const containerClient = createContainerClient();
    const blockBlobContainer = containerClient.getBlockBlobClient(
      `${breakDetails.meeting.id.value}.json`
    );

    this.breakJobManager.start(breakDetails);

    await blockBlobContainer.upload(breakDetailsJson, breakDetailsJson.length);
    this.cacheService.put(
      breakDetails.meeting.id.value,
      breakDetails,
      breakDetails.duration.minutes * 60 + breakDetails.duration.seconds
    );
  }

  async updateBreak(breakDetails: UpdateBreakDetailsInput) {}

  async getBreak(meetingId: string): Promise<GetBreakDetailsPayload> {
    const cachedBreakDetails = this.cacheService.get(
      meetingId
    ) as GetBreakDetailsPayload;
    if (cachedBreakDetails) {
      return cachedBreakDetails;
    }

    const blobContainer = createContainerClient().getBlockBlobClient(
      `${meetingId}.json`
    );
    const data = await streamToString(
      (
        await blobContainer.download()
      ).readableStreamBody
    );
    const breakDetails = JSON.parse(data) as GetBreakDetailsPayload;

    return breakDetails;
  }
}
