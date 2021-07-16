import { Conversation } from "./conversation";
import { Details } from "./details";
import { Organizer } from "./organizer";

export interface MeetingDetailsResponse {
    details:      Details;
    conversation: Conversation;
    organizer:    Organizer;
}