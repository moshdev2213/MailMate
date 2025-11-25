import { ImapFlow } from "imapflow";
import logger from "../config/logging";
import { EmailMetaData, emailRepository } from "../repositories/email.repository";
import { createImapClient } from "../utils/xoauth.util";
import { userService } from "./user.service";
import { sanitizeInput } from "../utils/validation.util";

class EmailService {
    async fetchEmailsFromGmail(userId: number, limit: number = 50): Promise<EmailMetaData[]> {
        let client: ImapFlow | null = null;
        try {
            const user = await userService.findById(userId);
            const accessToken = await userService.getAccessToken(userId);

            client = await createImapClient(user.email, accessToken);

            const mailbox = await client.mailboxOpen('INBOX');
            const messages: EmailMetaData[] = [];

            const uidSequence = `1:${Math.min(limit, mailbox.exists)}`;

            // Fetch all messages first
            const fetchedMessages = [];
            for await (const message of client.fetch(uidSequence, { envelope: true, uid: true })) {
                fetchedMessages.push(message);
            }

            for (let i = 0; i < fetchedMessages.length; i++) {
                const message = fetchedMessages[i];
                const envelope = message.envelope;

                if (!envelope) {
                    continue;
                }

                const from = envelope.from
                    ?.map((addr) => `${addr.name || ''} <${addr.address}>`)
                    .join(', ')
                    .substring(0, 500);

                const subject = envelope.subject ? sanitizeInput(envelope.subject).substring(0, 500) : null;
                const messageId = envelope.messageId ? sanitizeInput(envelope.messageId) : null;

                messages.push({
                    userId,
                    gmailUid: message.uid.toString(),
                    from: from || undefined,
                    subject: subject || undefined,
                    messageId: messageId || undefined,
                    date: envelope.date || undefined,
                });
            }
            await this.saveEmailsToDatabase(userId, messages);
            return messages;
        } catch (error) {
            logger.error('Failed to fetch emails from Gmail', { error, userId });
            throw new Error('Failed to fetch emails from Gmail');
        } finally {
            if (client) {
                try {
                    await client.logout();
                } catch (error) {
                    logger.warn('Failed to logout IMAP client', { error });
                }
            }
        }
    }
    async saveEmailsToDatabase(userId: number, emails: EmailMetaData[]): Promise<void> {
        try {
            const emailData: EmailMetaData[] = emails.map((email) => ({
                userId,
                gmailUid: email.gmailUid,
                from: email.from || null,
                subject: email.subject || null,
                messageId: email.messageId || null,
                date: email.date || null,
            }))
            await emailRepository.bulkUpsert(emailData);

        } catch (error) {
            logger.error('Failed to save emails to database', { error, userId });
            throw new Error('Failed to save emails to database');
        }
    }
    async getEmailsFromDatabase(
        userId: number,
        limit: number,
        offset: number,
        search?: string
    ) {
        return emailRepository.findManyByUserId(userId, limit, offset, search)
    }
}
export const emailService = new EmailService()