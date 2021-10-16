import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/authConfig';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@injectable()
class SessionService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) { }

    public async execute({ email, password }: Request): Promise<Response> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('incorrect email/passord', 401);
        }

        const passwordMatch = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMatch) {
            throw new AppError('incorrect email/password', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default SessionService;
