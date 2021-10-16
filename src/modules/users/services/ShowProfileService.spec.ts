import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to update profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'john tre',
            email: 'johntre@zema.com',
        });

        expect(updatedUser.name).toBe('john tre');
        expect(updatedUser.email).toBe('johntre@zema.com');
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        const user = await fakeUsersRepository.create({
            name: 'teste',
            email: 'teste@zema.com',
            password: '12233',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'john tre',
                email: 'johntre@zema.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should be able to update password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'john tre',
            email: 'johntre@zema.com',
            old_password: '12233',
            password: '1223344',
        });

        expect(updatedUser.password).toBe('1223344');
    });
    it('should be able to update password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'john tre',
                email: 'johntre@zema.com',
                password: '1223344',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'john tre',
                email: 'johntre@zema.com',
                password: '1223344',
                old_password: 'wrong-old-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
