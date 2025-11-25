import { ImapFlow } from "imapflow";

export interface XOAuth2Credentials {
    user: string;
    accessToken: string;
}

export async function createImapClient(
    email: string,
    accessToken: string
): Promise<ImapFlow> {
    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: {
            user: email,
            accessToken,
        },
    });

    await client.connect();
    return client;
}