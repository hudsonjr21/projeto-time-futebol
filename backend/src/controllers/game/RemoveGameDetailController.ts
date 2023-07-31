import {Request, Response} from 'express'
import { RemoveGameDetailService } from '../../services/game/RemoveGameDetailService'

class RemoveGameDetailController{
  async handle(req: Request, res: Response){
    const gameDetail_id = req.query.gameDetail_id as string;

    const removeGameDetailService = new RemoveGameDetailService();

    const game = await removeGameDetailService.execute({
      gameDetail_id
    })

    return res.json(game);

  }
}

export { RemoveGameDetailController }