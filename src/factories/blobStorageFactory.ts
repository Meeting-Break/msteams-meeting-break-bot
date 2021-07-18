import { BlobServiceClient } from "@azure/storage-blob";

export default function createContainerClient() {
    const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString)
    const meetingBreaksContainerClient = blobServiceClient.getContainerClient("meeting-breaks")
    return meetingBreaksContainerClient;
}