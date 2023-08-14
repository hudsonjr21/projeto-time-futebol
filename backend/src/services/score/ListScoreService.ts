import prismaClient from "../../prisma";

class ListScoreService{
  async execute(){

    const score = await prismaClient.score.findMany({
      select:{
        id: true,
        home_score: true,
        away_score: true,
        game_id: true,
      }
    })

    return score;

  }
}

export { ListScoreService }