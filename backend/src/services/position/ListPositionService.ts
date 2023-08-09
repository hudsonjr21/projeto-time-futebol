import prismaClient from "../../prisma";

class ListPositionService{
  async execute(){

    const position = await prismaClient.position.findMany({
      select:{
        id: true,
        name: true,
      }
    })

    return position;

  }
}

export { ListPositionService }