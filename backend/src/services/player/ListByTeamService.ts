import prismaClient from "../../prisma";

interface PlayerRequest{
  team_id: string;
}

class ListByTeamService{
  async execute({ team_id }: PlayerRequest){
    
    const findByTeam = await prismaClient.player.findMany({
      where:{
        team_id: team_id
      }
    })

    return findByTeam;

  }
}

export { ListByTeamService }