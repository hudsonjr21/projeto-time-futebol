import {Request, Response} from 'express'
import { ListByTeamService } from '../../services/player/ListByTeamService';

class ListByTeamController{
  async handle(req: Request, res: Response){
    const team_id = req.query.team_id as string;

    const listByTeam = new ListByTeamService();

    const players = await listByTeam.execute({
      team_id
    });

    return res.json(players);

  }
}

export { ListByTeamController }