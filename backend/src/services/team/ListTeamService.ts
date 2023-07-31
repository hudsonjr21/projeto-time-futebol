import prismaClient from "../../prisma";

class ListTeamService{
  async execute(){

    const team = await prismaClient.team.findMany({
      select:{
        id: true,
        name: true,
        logo: true,
      }
    })

    return team;

  }
}

export { ListTeamService }