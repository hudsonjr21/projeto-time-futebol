import {Request, Response} from 'express'
import { ListScoreService } from '../../services/score/ListScoreService';

class ListScoreController{
  async handle(req: Request, res: Response){
    const listScoreService = new ListScoreService();

    const score = await listScoreService.execute();

    return res.json(score);

  }
}

export { ListScoreController }