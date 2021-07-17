import { Meeting } from "./meeting";
import { User } from "./user";

export interface ParticipantDetailsResponse {
    user: User;
    meeting: Meeting;
}