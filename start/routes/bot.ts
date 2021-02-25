import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.resource('bots', 'BotsController').apiOnly();
  Route.post('bots/:id/start', 'BotsController.start');
  Route.post('bots/:id/stop', 'BotsController.stop');
})
  .prefix('api')
  .middleware('auth');
