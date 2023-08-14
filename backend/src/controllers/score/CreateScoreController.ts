import {Request, Response} from 'express'
import { CreateScoreService } from '../../services/score/CreateScoreService';


class CreateScoreController{
  async handle(req: Request, res: Response){
    const { homeScore, awayScore, game_id } = req.body;

    const createScoreService = new CreateScoreService();

    const score = await createScoreService.execute({
      homeScore,
      awayScore,
      game_id
    });

    return res.json(score);

  }
}

export { CreateScoreController }