import { rules, schema } from '@ioc:Adonis/Core/Validator';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RegisterValidator from 'App/Validators/RegisterValidator';
import User from 'App/Models/User';

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string(),
      }),
    });

    const { email, password } = request.only(['email', 'password']);

    const { token } = await auth.attempt(email, password);

    return response.header('Authorization', token);
  }

  public async me({ response, auth }: HttpContextContract) {
    return response.json(auth.user);
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(RegisterValidator);

    const user = await User.create(data);

    const { token } = await auth.login(user);

    return response.header('Authorization', token).json(user);
  }
}
