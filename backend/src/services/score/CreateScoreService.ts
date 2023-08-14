import prismaClient from "../../prisma";

interface ScoreRequest{
  homeScore: number;
  awayScore: number;
  game_id: string;
}

class CreateScoreService{
  async execute({ homeScore, awayScore, game_id}: ScoreRequest){

    const score = await prismaClient.score.create({
      data:{
        home_score: homeScore,
        away_score: awayScore,
        game_id: game_id,
      },
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

export { CreateScoreService }