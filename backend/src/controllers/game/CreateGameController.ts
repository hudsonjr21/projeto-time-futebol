import {Request, Response} from 'express'
import { CreateGameService } from '../../services/game/CreateGameService';

class CreateGameController{
  async handle(req: Request, res: Response){
    const { numberGame, day, homeTeam, awayTeam } = req.body;

    const createGameService = new CreateGameService();

    const game = await createGameService.execute({
      numberGame,
      day,
      homeTeam,
      awayTeam,

    });

    return res.json(game);

  }
}

export { CreateGameController }