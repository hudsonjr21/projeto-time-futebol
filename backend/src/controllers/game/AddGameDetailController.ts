import {Request, Response} from 'express'
import { AddGameDetailService } from '../../services/game/AddGameDetailService';


class AddGameDetailController{
  async handle(req: Request, res: Response){
    const { game_id, player_id, score } = req.body;

    const addGameDetail= new AddGameDetailService();

    const game = await addGameDetail.execute({
      game_id,
      player_id,
      score
    })

    return res.json(game);

  }
}

export { AddGameDetailController }