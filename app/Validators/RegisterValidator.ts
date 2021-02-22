import { rules, schema } from '@ioc:Adonis/Core/Validator';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string(
      {
        trim: true,
      },
      [
        rules.email(),
        rules.unique({
          table: 'users',
          column: 'email',
        }),
      ],
    ),
    password: schema.string(
      {
        trim: true,
      },
      [rules.required()],
    ),
  });
}
