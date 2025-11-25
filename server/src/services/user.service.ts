import { userRepository, CreateUserData } from "../repositories/user.repository";
import { tokenService } from "./token.service";

class UserService {
    async findOrCreateUser(data: CreateUserData) {
        let user = await userRepository.findByGoogleId(data.googleId);

        if (!user) {
            user = await userRepository.create(data);
        } else if (data.refreshToken && data.refreshToken !== user.refreshToken) {
            user = await userRepository.updateRefreshToken(user.id, data.refreshToken);
        }

        return user;
    }

    async findById(id: number) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async findByIdWithEmail(id: number) {
        const user = await userRepository.findByIdWithEmail(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAccessToken(userId: number): Promise<string> {
        const user = await userRepository.findById(userId)
        if (!user || !user.refreshToken) {
            throw new Error('User has no refresh token');
        }
        try {
            const tokenResponse = await tokenService.refreshAccessToken(user.refreshToken)
            if (tokenResponse.refresh_token) {
                await userRepository.updateRefreshToken(userId, tokenResponse.refresh_token);
            }
            return tokenResponse.access_token;
        } catch (error) {
            throw new Error('Failed to get access token');
        }
    }
}
export const userService = new UserService();