import { Request, Response } from "express";

class WhatsappController {
  public index(request: Request, response: Response) {
    response.json({"ok": true});
  }
}

export default new WhatsappController;