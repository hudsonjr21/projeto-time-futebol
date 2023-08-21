import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'

interface UserRequest{
  name: string;
  email: string;
  password: string;
  cellNumber: string;
}

class CreateUserService{
  async execute({ name, email, password, cellNumber }: UserRequest){

    // verificar se ele enviou um email
    if(!email){
      throw new Error("Email incorrect")
    }

    //Verificar se esse email já está cadastrado na plataforma
    const userAlreadyExists = await prismaClient.user.findFirst({
      where:{
        email: email
      }
    })

    if(userAlreadyExists){
      throw new Error("User already exists")
    }

    const passwordHash = await hash(password, 8)

    const user = await prismaClient.user.create({
      data:{
        name: name,
        email: email,
        password: passwordHash,
        cellNumber: cellNumber,
        role: 'user',
      },
      select:{
        id: true,
        name: true,       
        email: true,
        cellNumber: true,
        role: true,
      }
    })


    return user;
  }
}

export { CreateUserService }