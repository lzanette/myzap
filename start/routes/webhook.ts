import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('webhook', 'WebhooksController.store');
}).prefix('api');
