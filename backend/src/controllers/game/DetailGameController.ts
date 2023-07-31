import {Request, Response} from 'express'
import { DetailGameService } from '../../services/game/DetailGameSerivce'



class DetailGameController{
  async handle(req: Request, res: Response){
    const game_id = req.query.order_id as string;

    const detailGameService = new DetailGameService();

    const games = await detailGameService.execute({
      game_id
    })

    return res.json(games);

  }
}

export { DetailGameController }