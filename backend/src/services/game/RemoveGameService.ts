import prismaClient from "../../prisma";

interface GameRequest{
  game_id: string;
}

class RemoveGameService{
  async execute({ game_id }: GameRequest){

    const game = await prismaClient.game.delete({
      where:{
        id: game_id,
      }
    })

    return game;

  }
}

export { RemoveGameService }