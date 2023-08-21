import { compare, hash } from 'bcryptjs';
import prismaClient from '../../prisma';

interface UpdateUserRequest {
    id: string;
    name: string;
    email: string;
    cellNumber: string;
    // currentPassword: string;
    // newPassword: string;
  }
  
  class UpdateUserService {
    async execute({
      id,
      name,
      email,
      cellNumber,
    //   currentPassword,
    //   newPassword,
    }: UpdateUserRequest) {
      const user = await prismaClient.user.findUnique({ where: { id } });
  
      if (!user) {
        throw new Error('User not found');
      }
  
    //   const passwordMatches = await compare(currentPassword, user.password);
  
    //   if (!passwordMatches) {
    //     throw new Error('Invalid current password');
    //   }
  
    //   if (currentPassword === newPassword) {
    //     throw new Error('New password must be different from current password');
    //   }
  
    //   const passwordHash = await hash(newPassword, 8);
  
      const updatedUser = await prismaClient.user.update({
        where: { id },
        data: {
          name,
          email,
          cellNumber,
        //   password: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          cellNumber: true,
          role: true,
        },
      });
  
      return updatedUser;
    }
  }
  
  export { UpdateUserService };
