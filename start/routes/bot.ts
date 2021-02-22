import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.resource('bots', 'BotsController').apiOnly();
})
  .prefix('api')
  .middleware('auth');
