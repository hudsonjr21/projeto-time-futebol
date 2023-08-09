import {Request, Response } from 'express'
import { CreatePlayerService } from '../../services/player/CreatePlayerService'


class CreatePlayerController{
  async handle(req: Request, res: Response){
    const { name, position_id, birthday, team_id } = req.body;

    const createPlayerService = new CreatePlayerService();

    if(!req.file){
      throw new Error("error upload file")
    }else{

      const { originalname, filename: profile } = req.file;

      const player = await createPlayerService.execute({
        name,
        profile,
        position_id,
        birthday,
        team_id
      });
  
      return res.json(player)
    }

  }
}

export { CreatePlayerController }
