import { google } from 'googleapis';
import { GoogleAuthService } from '../../infrastructure/service/GoogleAuthService';
import { DriveActivity } from '../domain/DriveActivity';

export class DriveActivityService {
    private authService: GoogleAuthService;

    constructor(authService: GoogleAuthService) {
        this.authService = authService;
    }

    public async listDownloadActivities(startTimeISO: string): Promise<DriveActivity[]> {
        const auth = await this.authService.getCredential();
        const reports = google.admin({ version: 'reports_v1', auth });

        const res = await reports.activities.list({
            userKey: 'all',
            applicationName: 'drive',
            eventName: 'download',
            startTime: startTimeISO,
        });

        const activities = res.data.items || [];

        const mappedActivities = activities.map<DriveActivity>(activity => {
            const fileNames = activity.events?.flatMap(event =>
                event.parameters
                    ?.filter(param => param.name === 'doc_title' || param.name === 'file_name')
                    .map(param => param.value || '') || []
            ) || [];

            const owners = activity.events?.flatMap(event =>
                event.parameters
                    ?.filter(param => param.name === 'owner')
                    .map(param => param.value || '') || []
            ) || [];

            const parentFolders = activity.events?.flatMap(event =>
                event.parameters
                    ?.filter(param => param.name === 'parent' || param.name === 'folder_title')
                    .map(param => param.value || '') || []
            ) || [];

            return {
                email: activity.actor?.email || 'unknown',
                time: this.formatToBrasilia(activity.id?.time),
                originalTimeISO: activity.id?.time || '',
                eventType: 'download',
                fileNames,
                owners,
                parentFolders,
                device: activity.actor?.callerType || 'unknown',
                activityId: activity.id?.uniqueQualifier || '',
                isBulkDownload: false,
            };
        });

        return this.groupDownloadsBySession(mappedActivities);
    }

    private groupDownloadsBySession(activities: DriveActivity[]): DriveActivity[] {
        const grouped: Record<string, DriveActivity[]> = {};

        activities.forEach(activity => {
            const sessionKey = `${activity.email}_${activity.originalTimeISO}`;
            if (!grouped[sessionKey]) {
                grouped[sessionKey] = [];
            }
            grouped[sessionKey].push(activity);
        });

        const finalResults: DriveActivity[] = Object.values(grouped).map(sessionActivities => {
            const first = sessionActivities[0];

            return {
                email: first.email,
                time: first.time,
                originalTimeISO: first.originalTimeISO,
                eventType: first.eventType,
                device: first.device,
                activityId: first.activityId,
                fileNames: sessionActivities.flatMap(a => a.fileNames),
                owners: Array.from(new Set(sessionActivities.flatMap(a => a.owners))),
                parentFolders: Array.from(new Set(sessionActivities.flatMap(a => a.parentFolders))),
                isBulkDownload: sessionActivities.length > 1,
            };
        });

        return finalResults;
    }

    private formatToBrasilia(utcTime?: string): string | undefined {
        if (!utcTime) return undefined;
        const date = new Date(utcTime);
        return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    }
}
