import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.resource('bots', 'BotsController').apiOnly();
  Route.post('bots/:id/start', 'BotsController.start');
})
  .prefix('api')
  .middleware('auth');
