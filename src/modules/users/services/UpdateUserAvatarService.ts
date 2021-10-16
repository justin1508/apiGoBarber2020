import { inject, injectable } from 'tsyringe';
import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IStorageRepository from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageRepository')
        private storageRepository: IStorageRepository,
    ) { }

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );
        }

        if (user.avatar) {
            await this.storageRepository.deleteFile(user.avatar);
        }

        const fileName = await this.storageRepository.saveFile(avatarFilename);

        user.avatar = fileName;

        await this.usersRepository.save(user);

        return user;
    }
}
export default UpdateUserAvatarService;
