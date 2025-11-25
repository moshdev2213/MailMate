import prisma from "../config/prisma";
import { encrypt } from "../utils/crypto.util";

export interface CreateUserData {
    googleId: string;
    email: string;
    name?: string | null;
    refreshToken?: string | null;
}

class UserRepository {
    async findByGoogleId(googleId: string) {
        return prisma.user.findUnique({
            where: { googleId }
        })
    }
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        })
    }
    async findByIdWithEmail(id: number) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                emails: {
                    take: 10,
                    orderBy: { date: 'desc' }
                }
            }
        })
    }
    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id }
        })
    }
    async create(data: CreateUserData) {
        const encryptedRefreshToken = data.refreshToken
            ? encrypt(data.refreshToken)
            : null;

        return prisma.user.create({
            data: {
                googleId: data.googleId,
                email: data.email,
                name: data.name,
                refreshToken: encryptedRefreshToken,
            },
        });
    }
    async update(id: number, data: Partial<CreateUserData>) {
        const updateData: any = { ...data };

        if (data.refreshToken) {
            updateData.refreshToken = encrypt(data.refreshToken);
        }

        return prisma.user.update({
            where: { id },
            data: updateData,
        });
    }

    async updateRefreshToken(id: number, refreshToken: string | null) {
        const encryptedRefreshToken = refreshToken
            ? encrypt(refreshToken)
            : null;

        return prisma.user.update({
            where: { id },
            data: { refreshToken: encryptedRefreshToken },
        });
    }
}
export const userRepository = new UserRepository();