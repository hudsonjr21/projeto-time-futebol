import prismaClient from "../../prisma";

class ListGamesService{
  async execute(){

    const games = await prismaClient.game.findMany({
      orderBy:{
        created_at: 'desc'
      }
    })

    return games;

  }
}

export { ListGamesService }