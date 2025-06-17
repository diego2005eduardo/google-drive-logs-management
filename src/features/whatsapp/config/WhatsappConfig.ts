import * as dotenv from 'dotenv';
import {DriveActivity} from "../../drive/application/domain/DriveActivity";
dotenv.config();

export const WhatsappConfig = {
    API_URL: `${process.env.EVOLUTION_API_URL}${process.env.EVOLUTION_INSTANCE_NAME}` || 'http://evolutionapi.seudominio.com.br/message/sendText/instance',
    API_KEY: process.env.EVOLUTION_API_KEY || 'API_KEY',
    WHATSAPP_GROUP_ID: process.env.WHATSAPP_GROUP_ID || "GROUP ID"
};

export function buildWhatsappMessage(download: DriveActivity): string {
    return (
            `📥 *Novo Download Detectado!*\n\n` +
            `👤 *Usuário:* ${download.email}\n` +
            `🕒 *Horário:* ${download.time}\n\n` +
            `📁 *Pasta(s) Proprietária(s):* ${download.owners.join(', ')}\n` +
            `🔢 *Download em Massa:* ${download.isBulkDownload ? '✅ Sim' : '❌ Não'}\n\n` +
            `📄 *Arquivos:*\n` +
            download.fileNames.map((file: string) => `- ${file}`).join('\n')
    );
}