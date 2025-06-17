import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { API_SCOPES } from '../../config/GoogleConfig';

interface ServiceAccountKey {
    client_email: string;
    private_key: string;
}

export class GoogleAuthService {
    private readonly serviceAccountPath: string;
    private readonly accountUser: string;

    constructor(serviceAccountPath: string, accountUser: string) {
        this.serviceAccountPath = serviceAccountPath;
        this.accountUser = accountUser;
    }

    private loadServiceAccountKey(): ServiceAccountKey {
        const keyFilePath = path.resolve(this.serviceAccountPath);

        if (!fs.existsSync(keyFilePath)) {
            throw new Error(`Service account key file not found at path: ${keyFilePath}`);
        }

        const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');

        try {
            const key: ServiceAccountKey = JSON.parse(keyFileContent);

            if (!key.client_email || !key.private_key) {
                throw new Error('Invalid service account key file: missing client_email or private_key');
            }

            return key;
        } catch (error) {
            throw new Error(`Failed to parse service account key file: ${(error as Error).message}`);
        }
    }

    public async getCredential(): Promise<JWT> {
        const key = this.loadServiceAccountKey();

        const jwtClient = new google.auth.JWT({
            email: key.client_email,
            key: key.private_key,
            scopes: API_SCOPES,
            subject: this.accountUser,
        });

        await jwtClient.authorize();
        return jwtClient;
    }
}
