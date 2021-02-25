import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('login', 'AuthController.login');
  Route.post('register', 'AuthController.register');

  Route.get('me', 'AuthController.me').middleware('auth');
}).prefix('/api/auth');
