import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('should be able to recover password using email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johedoe@zema.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johhjojn@zema.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'johhjojn@zema.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'john',
            email: 'john@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'john@example.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
