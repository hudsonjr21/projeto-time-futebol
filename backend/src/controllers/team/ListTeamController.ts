import {Request, Response} from 'express'
import { ListTeamService } from '../../services/team/ListTeamService';

class ListTeamController{
  async handle(req: Request, res: Response){
    const listTeamService = new ListTeamService();

    const team = await listTeamService.execute();

    return res.json(team);

  }
}

export { ListTeamController }