import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async searchUsers(query: string) {
    if (!query) return [];
    
    return this.prisma.user.findMany({
      where: {
        email: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        email: true,
      },
      take: 10
    });
  }
}
