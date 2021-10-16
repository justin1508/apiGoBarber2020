import AppError from '@shared/errors/AppError';
import SessionService from './SessionService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let auth: SessionService;
let createUser: CreateUserService;

describe('SessionUser', () => {
    beforeAll(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        auth = new SessionService(fakeUsersRepository, fakeHashProvider);

        // createUser = new CreateUserService(
        //     fakeUsersRepository,
        //     fakeHashProvider,
        // );
    });
    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john Doe',
            email: 'johndoe@zema.com',
            password: '123',
        });

        const response = await auth.execute({
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            auth.execute({
                email: 'johhjojn@zema.com',
                password: '12233',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to not authenticate with wrong password', async () => {
        await fakeUsersRepository.create({
            name: 'john Doe',
            email: 'johndoe@zema.com',
            password: '123',
        });

        await expect(
            auth.execute({
                email: 'johhjojn@zema.com',
                password: '12233-wrong password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
