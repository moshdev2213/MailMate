import prisma from "../config/prisma";


export interface EmailMetaData {
    userId: number;
    gmailUid: string;
    from?: string | null;
    subject?: string | null;
    messageId?: string | null;
    date?: Date | null;
}

class EmailRepository {
    async findByUserAndUid(userId: number, gmailUid: string) {
        return prisma.emailMetadata.findUnique({
            where: {
                userId_gmailUid: {
                    userId,
                    gmailUid
                }
            }
        })
    }

    async upsert(data: EmailMetaData) {
        return prisma.emailMetadata.upsert({
            where: {
                userId_gmailUid: {
                    userId: data.userId,
                    gmailUid: data.gmailUid,
                },
            },
            update: {
                from: data.from,
                subject: data.subject,
                messageId: data.messageId,
                date: data.date,
            },
            create: data,
        })
    }
    async findManyByUserId(userId: number, limit: number, offset: number) {
        const [emails, total] = await Promise.all([
            prisma.emailMetadata.findMany({
                where: { userId },
                take: limit,
                skip: offset,
                orderBy: { date: 'desc' }
            }),
            prisma.emailMetadata.count({
                where: { userId }
            })
        ])
        return {
            emails,
            total,
            limit,
            offset,
        };
    }
    async bulkUpsert(emails: EmailMetaData[]) {
        // Process in batches to avoid transaction timeout
        const batchSize = 20;
        const batches = [];

        for (let i = 0; i < emails.length; i += batchSize) {
            batches.push(emails.slice(i, i + batchSize));
        }

        // Process each batch in a separate transaction with increased timeout
        for (const batch of batches) {
            await prisma.$transaction(async (tx) => {
                for (const email of batch) {
                    await tx.emailMetadata.upsert({
                        where: {
                            userId_gmailUid: {
                                userId: email.userId,
                                gmailUid: email.gmailUid,
                            },
                        },
                        update: {
                            from: email.from,
                            subject: email.subject,
                            messageId: email.messageId,
                            date: email.date,
                        },
                        create: email,
                    });
                }
            }, {
                timeout: 30000, // 30 seconds timeout per batch
            });
        }
    }
}
export const emailRepository = new EmailRepository()