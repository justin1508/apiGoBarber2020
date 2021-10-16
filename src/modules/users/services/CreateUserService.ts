import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
// Recebimento das informações
// tratativa de erros e excecoes
// acesso ao repositorio

interface Request {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({ name, email, password }: Request): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists)
            throw new AppError('this email already exists', 401);

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await this.cacheProvider.invalidatePrefix('providers-list:*');
        // await this.cacheProvider.invalidatePrefix('providers-list');

        return user;
    }
}

export default CreateUserService;
