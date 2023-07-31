import {Request, Response} from 'express'
import { SendGameService } from '../../services/game/SendGameService';

class SendGameController{
  async handle(req: Request, res: Response){
    const { game_id } = req.body;

    const sendGame = new SendGameService();

    const game = await sendGame.execute({
      game_id
    });

    return res.json(game);

  }
}

export { SendGameController }