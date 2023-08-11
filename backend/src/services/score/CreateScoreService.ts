import prismaClient from "../../prisma";

interface ScoreRequest{
  homeScore: number;
  awayScore: number;
}

class CreateScoreService{
  async execute({ homeScore, awayScore }: ScoreRequest){

    const score = await prismaClient.score.create({
      data:{
        home_score: homeScore,
        away_score: awayScore,
      },
      select:{
        id: true,
        home_score: true,
        away_score: true,

      }
    })


    return score;

  }
}

export { CreateScoreService }