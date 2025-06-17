import * as dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
    TIMEZONE: 'America/Sao_Paulo',
    ACCOUNT_USER: process.env.ACCOUNT_USER || "user@domain.com.br",
    JSON_FILE_PATH: process.env.JSON_FILE_PATH || 'credentials.json',
    CHECK_INTERVAL_MS: Number(process.env.CHECK_INTERVAL_MS) || 60 * 1000,
};