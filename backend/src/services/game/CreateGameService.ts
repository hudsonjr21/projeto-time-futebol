import prismaClient from "../../prisma";

interface GameRequest{
  numberGame: number;
  day: string;
}

class CreateGameService{
  async execute({ numberGame, day}: GameRequest ){

    const existingGame = await prismaClient.game.findFirst({
      where: {
        numberGame: numberGame,
      },
    });

    if (existingGame) {
      throw new Error('Este número de jogo já está em uso.');
    }

    const game = await prismaClient.game.create({
      data:{
        numberGame,
        day,
      }
    })


    return game;

  }
}

export { CreateGameService }