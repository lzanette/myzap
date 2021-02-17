import { Router, Request, Response } from 'express';

const whatsappRoutes = Router();

whatsappRoutes.get('/', async (request: Request, response: Response) => {
  return response.json({"ok": true});
});

export default whatsappRoutes;