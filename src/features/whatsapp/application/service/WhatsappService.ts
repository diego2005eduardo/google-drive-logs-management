import axios from 'axios';
import { WhatsappConfig } from '../../config/WhatsappConfig';
import { MessagePayload } from '../domain/MessagePayload';
import { logger } from '../../../common/utils/Logger';

export class WhatsappService {
    public async sendTextMessage(payload: MessagePayload): Promise<void> {
        try {
            const response = await axios.post(WhatsappConfig.API_URL, {
                number: payload.id + "@g.us",
                text: payload.message,
            }, {
                headers: {
                    apikey: WhatsappConfig.API_KEY,
                    'Content-Type': 'application/json',
                },
            });

            logger.info(`Mensagem enviada com sucesso para grupo de ID ${payload.id}. Status: ${response.status}`);
        } catch (error) {
            logger.error(`Erro ao enviar mensagem para grupo de ID ${payload.id}:`, error);
        }
    }
}
