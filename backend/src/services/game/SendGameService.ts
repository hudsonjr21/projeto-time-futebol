import prismaClient from "../../prisma";

interface GameRequest{
  game_id: string;
}

class SendGameService{
  async execute({ game_id }: GameRequest){
    const game = await prismaClient.game.update({
      where:{
        id: game_id
      },
      data:{
        draft: false
      }
    })

    return game;

  }
}

export { SendGameService }