import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('send', 'WebhooksController.store');
}).prefix('api');
