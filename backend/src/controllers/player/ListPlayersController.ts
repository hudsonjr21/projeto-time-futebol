import {Request, Response} from 'express'
import { ListPlayerService } from '../../services/player/ListPlayersService';


class ListPlayersController{
  async handle(req: Request, res: Response){
    const listPlayersService = new ListPlayerService();

    const players = await listPlayersService.execute();

    return res.json(players);

  }
}

export { ListPlayersController }