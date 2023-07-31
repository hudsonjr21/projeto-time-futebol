import prismaClient from "../../prisma";

interface GameDetailRequest{
  gameDetail_id: string;
}

class RemoveGameDetailService{
  async execute({ gameDetail_id }: GameDetailRequest){

    const game = await prismaClient.gameDetail.delete({
      where:{
        id: gameDetail_id 
      }
    })

    return game;
    
  }
}

export { RemoveGameDetailService }