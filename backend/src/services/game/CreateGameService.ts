import prismaClient from "../../prisma";

interface GameRequest{
  day: string;
  name: string;
}

class CreateGameService{
  async execute({ day, name}: GameRequest ){

    const game = await prismaClient.game.create({
      data:{
        day: day,
        name: name
      }
    })


    return game;

  }
}

export { CreateGameService }