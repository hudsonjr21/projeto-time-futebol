import prismaClient from "../../prisma";

interface GameDetailRequest{
  game_id: string;
  player_id: string;
  score: number;
}

class AddGameDetailService{
  async execute({ game_id, player_id, score }: GameDetailRequest){

    const game = await prismaClient.gameDetail.create({
      data:{
        game_id: game_id,
        player_id: player_id,
        score
      }
    })

    return game;

  }
}

export { AddGameDetailService }