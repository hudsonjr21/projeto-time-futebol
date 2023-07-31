import {Request, Response} from 'express'
import { CreateTeamService } from '../../services/team/CreateTeamService';


class CreateTeamController{
  async handle(req: Request, res: Response){
    const { name } = req.body;

    const createTeamService = new CreateTeamService();
    
    if(!req.file){
      throw new Error("error upload file")
    }else{

      const { originalname, filename: logo } = req.file;

    const team = await createTeamService.execute({
      name,
      logo
    });

    return res.json(team);
    }
    
  }
}

export { CreateTeamController }