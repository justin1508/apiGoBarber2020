import AppError from '@shared/errors/AppError';

import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });
    it('should be able to show profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johhjojn@zema.com',
            password: '12233',
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('john doe');
        expect(profile.email).toBe('johhjojn@zema.com');
    });
    it('should not be able to show profile from non-existing user', async () => {
        await expect(
            showProfile.execute({
                user_id: 'non-existing user id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to update profile from non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing user id',
                name: 'non-existing user id',
                email: 'non-existing user id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
