import prismaClient from "../../prisma";

interface TeamRequest{
  name: string;
  logo?: string;
}

class CreateTeamService{
  async execute({ name, logo }: TeamRequest){
    
    if(name === ''){
      throw new Error('Name invalid')
    }

    const team = await prismaClient.team.create({
      data:{
        name: name,
        logo: logo,
      },
      select:{
        id: true,
        name: true,
      }
    })


    return team;

  }
}

export { CreateTeamService }