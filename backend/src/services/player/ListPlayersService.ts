import prismaClient from "../../prisma";

class ListPlayerService{
  async execute(){

    const players = await prismaClient.player.findMany({
      select:{
        name: true, 
        profile: true, 
        position_id: true, 
        birthday: true, 
        team_id: true
      }
    })

    return players;

  }
}

export { ListPlayerService }