import prismaClient from "../../prisma";

interface PositionRequest{
  name: string;
}

class CreatePositionService{
  async execute({ name }: PositionRequest){
    
    if(name === ''){
      throw new Error('Name invalid')
    }
    const normalizedPositionName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const existingPosition = await prismaClient.position.findFirst({
      where: {
        name: normalizedPositionName,
      },
    });

    if (existingPosition) {
      throw new Error('Esta posição já existe.');
    }

    const position = await prismaClient.position.create({
      data:{
        name: name,
      },
      select:{
        id: true,
        name: true,
      }
    })


    return position;

  }
}

export { CreatePositionService }