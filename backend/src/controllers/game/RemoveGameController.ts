import {Request, Response} from 'express'
import { RemoveGameService } from '../../services/game/RemoveGameService';


class RemoveGameController{
  async handle(req: Request, res: Response){
    const game_id = req.query.game_id as string;

    const removeGame = new RemoveGameService();

    const game = await removeGame.execute({
      game_id
    });

    return res.json(game);

  }
}

export { RemoveGameController }
