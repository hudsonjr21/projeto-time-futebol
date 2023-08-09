import prismaClient from "../../prisma";
import { parseISO, differenceInYears } from 'date-fns';


interface PlayerRequest{
  name: string;
  profile: string;
  position_id: string;
  birthday: string;
  team_id: string;
}

class CreatePlayerService{
  async execute({
    name, 
    profile, 
    position_id, 
    birthday, 
    team_id
  }: PlayerRequest){

    // Calcula a idade do jogador com base na data de nascimento
    const birthDate = new Date(birthday);
    const currentDate = new Date();

    const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365);

    // Verifica se a idade está dentro dos limites (5 a 100 anos)
    if (ageInYears < 5 || ageInYears > 100) {
      throw new Error('Data de aniversário inválida.');
    }

    const player = await prismaClient.player.create({
      data:{
        name: name,
        profile: profile,
        position_id: position_id,
        birthday: birthday,
        team_id: team_id,
      }
    })

    return player;

  }
}

export { CreatePlayerService }

