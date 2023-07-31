import prismaClient from "../../prisma";

interface PlayerRequest{
  name: string;
  profile: string;
  position: string;
  birthday: string;
  team_id: string;
}

class CreatePlayerService{
  async execute({name, profile, position, birthday, team_id}: PlayerRequest){

    const player = await prismaClient.player.create({
      data:{
        name: name,
        profile: profile,
        position: position,
        birthday: birthday,
        team_id: team_id,
      }
    })

    return player;

  }
}

export { CreatePlayerService }

