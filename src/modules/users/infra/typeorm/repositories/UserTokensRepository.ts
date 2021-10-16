import { getRepository, Repository } from 'typeorm';
import IUserTokensRepository from '@modules/users/repositories/IUserTokenRepository';

import UserToken from '../entities/UserToken';

// DTO date transfer object -> tranferencia de um arquivo pra outro
// interface CreateAppointmentDTO {
//     provider: string;
//     date: Date;
// }

class UserTokensRepository implements IUserTokensRepository {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: { token },
        });

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            user_id,
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UserTokensRepository;