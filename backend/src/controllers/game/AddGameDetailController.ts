import { Request, Response } from 'express';
import { AddGameDetailService } from '../../services/game/AddGameDetailService';

class AddGameDetailController {
  async handle(req: Request, res: Response) {
    const { game_id, players } = req.body;

    const addGameDetail = new AddGameDetailService();

    const gameDetails = [];

    for (const player of players) {
      const { player_id, score } = player;

      try {
        const gameDetail = await addGameDetail.execute({
          game_id,
          player_id,
          score,
        });

        gameDetails.push(gameDetail);
      } catch (error) {
        return res.status(500).json({ error: 'Erro ao salvar Jogo!!' });
      }
    }

    return res.json(gameDetails);
  }
}

export { AddGameDetailController };
