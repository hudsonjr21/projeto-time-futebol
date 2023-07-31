import prismaClient from "../../prisma";

interface DetailRequest{
  game_id: string;
}

class DetailGameService{
  async execute({ game_id }: DetailRequest){

    const games = await prismaClient.gameDetail.findMany({
      where:{
        game_id: game_id
      },
      include:{
        player:true,
        game:true,
      }
    })

    return games;

  }
}

export { DetailGameService }