import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

// Recebimento das informações
// tratativa de erros e excecoes
// acesso ao repositorio

interface Request {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({
        provider_id,
        date,
        user_id,
    }: Request): Promise<Appointment> {
        console.log('appointmentDate');
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                "You can't create an appointment on a past date",
            );
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                'You can create appointment between 8am and 5pm',
            );
        }

        if (user_id === provider_id) {
            throw new AppError("You can't create an appointment with yourself");
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id,
        );

        if (findAppointmentInSameDate)
            throw new AppError('this appointment is already booked', 400);

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        const dateFormatted = format(
            appointmentDate,
            "dd/MM/yyyy 'às' HH:mm'h'",
        );

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`,
        });

        await this.cacheProvider.invalidate(
            `provider-appointments:${format(appointmentDate, 'yyyy-M-d')}`,
        );

        return appointment;
    }
}

export default CreateAppointmentService;
