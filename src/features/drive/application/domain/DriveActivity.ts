export interface DriveActivity {
  email: string;
  time?: string;
  originalTimeISO: string;
  eventType: string;
  fileNames: string[];
  owners: string[];
  parentFolders: string[];
  device: string;
  activityId: string;
  isBulkDownload: boolean;
}
