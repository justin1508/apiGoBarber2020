import SessionService from '@modules/users/services/SessionService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const session = container.resolve(SessionService);

        const { user, token } = await session.execute({
            email,
            password,
        });

        return response.json({ user: classToClass(user), token });
    }
}
