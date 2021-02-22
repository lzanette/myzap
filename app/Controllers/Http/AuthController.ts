import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RegisterValidator from 'App/Validators/RegisterValidator';
import User from 'App/Models/User';

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']);

    const { token } = await auth.attempt(email, password);

    return response.header('Authorization', token);
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(RegisterValidator);

    const user = await User.create(data);

    const { token } = await auth.login(user);

    return response.header('Authorization', token).json(user);
  }
}
