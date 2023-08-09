import {Request, Response} from 'express'
import { CreateGameService } from '../../services/game/CreateGameService';

class CreateGameController{
  async handle(req: Request, res: Response){
    const { numberGame, day } = req.body;

    const createGameService = new CreateGameService();

    const game = await createGameService.execute({
      numberGame,
      day,

    });

    return res.json(game);

  }
}

export { CreateGameController }