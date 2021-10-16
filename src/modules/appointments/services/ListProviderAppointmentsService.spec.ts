import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });
    it('should be able to list all day appointment', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            user_id: 'provider',
            provider_id: 'user',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            user_id: 'provider',
            provider_id: 'user',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });

        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
