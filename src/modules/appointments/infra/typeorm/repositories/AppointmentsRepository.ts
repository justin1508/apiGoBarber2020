import { getRepository, Repository, Raw } from 'typeorm';
// eslint-disable-next-line import/order
import Appointment from '../entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllDayFromProviderDTO';

// DTO date transfer object -> tranferencia de um arquivo pra outro
// interface CreateAppointmentDTO {
//     provider: string;
//     date: Date;
// }

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        console.log('21212');
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        // const findAppointment = this.appointments.find(appointment =>
        //     isEqual(date, appointment.date),
        // );

        const findAppointment = await this.ormRepository.findOne({
            where: { date, provide_id },
        });

        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, MM-YYYY) = '${parsedMonth}-${year}'`,
                ),
            },
        });
        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        month,
        year,
        day,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');
        const parsedDay = String(day).padStart(2, '0');
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        // `to_char(${dateFieldName}, DD-MM-YYYY) = '${parsedDay}-${parsedMonth}-${year}'`,
                        `to_char(Appointment.date, DD-MM-YYYY) = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        });
        return appointments;
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        console.log('Appointmenttt');
        const appointment = this.ormRepository.create({
            provider_id,
            date,
            user_id,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
