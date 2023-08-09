import {Request, Response} from 'express'
import { CreatePositionService } from '../../services/position/CreatePositionService';


class CreatePositionController{
  async handle(req: Request, res: Response){
    const { name } = req.body;

    const createPositionService = new CreatePositionService();


    const position = await createPositionService.execute({
      name,
    });

    return res.json(position);
    }
    
  }

export { CreatePositionController }