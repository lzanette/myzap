import { Router } from 'express';
import WhatsappController from '@/app/controllers/WhatsappController'

const whatsappRoutes = Router();

whatsappRoutes.get('/', WhatsappController.index);

export default whatsappRoutes;