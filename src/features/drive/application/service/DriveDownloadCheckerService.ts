import { GoogleAuthService } from '../../infrastructure/service/GoogleAuthService';
import { DriveActivityService } from './DriveActivityService';
import { logger } from '../../../common/utils/Logger';
import { AppConfig } from '../../config/AppConfig';
import { DriveActivity } from '../domain/DriveActivity';

type DownloadsCallback = (downloads: DriveActivity[]) => Promise<void> | void;

export class DriveDownloadCheckerService {
    private lastCheckedTimestampISO: string;
    private lastDownloadSnapshot: string = '';
    private driveActivityService: DriveActivityService;
    private onNewDownloads: DownloadsCallback;

    constructor(onNewDownloads: DownloadsCallback) {

        const googleAuthService = new GoogleAuthService(AppConfig.JSON_FILE_PATH, AppConfig.ACCOUNT_USER);
        this.driveActivityService = new DriveActivityService(googleAuthService);

        this.lastCheckedTimestampISO = new Date(Date.now() - 60 * 1000).toISOString();
        this.onNewDownloads = onNewDownloads;
    }

    public start(): void {
        this.checkForNewDownloads();
        setInterval(() => this.checkForNewDownloads(), AppConfig.CHECK_INTERVAL_MS);
    }

    private async checkForNewDownloads(): Promise<void> {
        try {
            const recentDownloads = await this.driveActivityService.listDownloadActivities(this.lastCheckedTimestampISO);

            const newDownloads = recentDownloads.filter(download => {
                if (!download.originalTimeISO) return false;
                const downloadTime = new Date(download.originalTimeISO).getTime();
                const lastCheckTime = new Date(this.lastCheckedTimestampISO).getTime();
                return downloadTime > lastCheckTime;
            });

            const currentTime = new Date().toLocaleString('pt-BR', { timeZone: AppConfig.TIMEZONE });

            if (newDownloads.length === 0) {
                logger.info(`${currentTime} - Nenhum download novo.`);
                return;
            }

            logger.info(`${currentTime} - Novos downloads encontrados:`);
            console.log(JSON.stringify(newDownloads, null, 2));

            this.lastDownloadSnapshot = JSON.stringify(newDownloads);

            const latestDownloadTime = newDownloads
                .map(download => new Date(download.originalTimeISO).getTime())
                .filter(time => !isNaN(time))
                .sort((a, b) => b - a)[0];

            if (latestDownloadTime) {
                this.lastCheckedTimestampISO = new Date(latestDownloadTime + 1000).toISOString();
            }

            await this.onNewDownloads(newDownloads);

        } catch (error) {
            logger.error(`${new Date().toLocaleString('pt-BR', { timeZone: AppConfig.TIMEZONE })} - Erro ao buscar downloads:`, error);
        }
    }
}
