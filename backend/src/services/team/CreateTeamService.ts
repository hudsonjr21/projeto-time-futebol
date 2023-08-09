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

    const normalizedTeamName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Verifica se já existe um time com o mesmo nome
    const existingTeam = await prismaClient.team.findFirst({
      where: {
        name: normalizedTeamName,
      },
    });

    if (existingTeam) {
      throw new Error('Este nome de time já está em uso.');
    }

    // Se não houver time com o mesmo nome, crie um novo time
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