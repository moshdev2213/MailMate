import { userRepository, CreateUserData } from "../repositories/user.repository";

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
}
export const userService = new UserService();