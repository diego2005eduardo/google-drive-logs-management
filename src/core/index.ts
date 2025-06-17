import { DriveDownloadCheckerService } from '../features/drive/application/service/DriveDownloadCheckerService';
import { WhatsappService } from '../features/whatsapp/application/service/WhatsappService';
import {WhatsappConfig, buildWhatsappMessage} from "../features/whatsapp/config/WhatsappConfig";

async function main() {
    const whatsappService = new WhatsappService();

    async function onNewDriveDownloads(downloads: any[]) {
        for (const download of downloads) {
            const message = buildWhatsappMessage(download)
            await whatsappService.sendTextMessage({
                id: WhatsappConfig.WHATSAPP_GROUP_ID,
                message,
            });
        }
    }
    const driveChecker = new DriveDownloadCheckerService(onNewDriveDownloads);
    driveChecker.start();
}

main();
