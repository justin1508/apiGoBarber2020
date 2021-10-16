import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviders = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });
    it('should be able to list all profiles', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'john tre',
            email: 'johhjtre@zema.com',
            password: '12233',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'john qua',
            email: 'johhjqua@zema.com',
            password: '12233',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
