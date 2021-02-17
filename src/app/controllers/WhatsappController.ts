import { Request, Response } from "express";

import BotService from "../Bot/BotService";

class WhatsappController {
  async index(request: Request, response: Response) {
    const botService = new BotService;

    const session = await botService.init(<string>request.query.name);

    // console.log(session)

    response.json({ "ok": true });
  }
}

export default new WhatsappController;