import {Request, Response} from 'express'
import { CreateGameService } from '../../services/game/CreateGameService';

class CreateGameController{
  async handle(req: Request, res: Response){
    const { day, name } = req.body;

    const createGameService = new CreateGameService();

    const game = await createGameService.execute({
      day,
      name,
    });

    return res.json(game);

  }
}

export { CreateGameController }