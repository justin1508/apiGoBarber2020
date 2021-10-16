// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('Reset Password', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johedoe@zema.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            password: '123123',
            token,
        });

        const userPass = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toBeCalledWith('123123');
        expect(userPass?.password).toBe('123123');
    });

    it('should not be able to reset password with non existins token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with non existins user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-user',
        );
        await expect(
            resetPassword.execute({
                token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with more than tow hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johedoe@zema.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        expect(
            resetPassword.execute({
                password: '123123',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
