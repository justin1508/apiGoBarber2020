import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordsController from '@modules/users/infra/http/controllers/ForgotPasswordController';
import ResetPasswordController from '@modules/users/infra/http/controllers/ResetPasswordController';

const passwordsRouter = Router();
const passwordsController = new ForgotPasswordsController();
const resetController = new ResetPasswordController();

passwordsRouter.post(
    '/forgot',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().required(),
        },
    }),
    passwordsController.create,
);

passwordsRouter.post(
    '/reset',
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required(),
            password_confirmation: Joi.string()
                .required()
                .valid(Joi.ref('password')),
        },
    }),
    resetController.create,
);

export default passwordsRouter;
