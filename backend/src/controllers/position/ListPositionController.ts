import {Request, Response} from 'express'
import { ListPositionService } from '../../services/position/ListPositionService';

class ListPositionController{
  async handle(req: Request, res: Response){
    const listPositionService = new ListPositionService();

    const position = await listPositionService.execute();

    return res.json(position);

  }
}

export { ListPositionController }