import { Request, Response, Router } from 'express';

import whatsappRoutes from './whatsappRoutes';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
  return response.json({ message: 'Whatsapp BOT V 1.0.0' });
});

routes.use('/whatsapp', whatsappRoutes)

export default routes;