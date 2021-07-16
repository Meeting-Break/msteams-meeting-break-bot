import { Conversation } from "./Conversation";
import { Details } from "./Details";
import { Organizer } from "./Organizer";

export interface MeetingDetailsResponse {
    details:      Details;
    conversation: Conversation;
    organizer:    Organizer;
}