import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe() {
    const user = await this.userService.getUserByEmail('demo@linguaverse.com');
    return { success: true, user };
  }

  @Get('search')
  async searchUsers(@Query('q') query: string) {
    const results = await this.userService.searchUsers(query);
    return { success: true, results };
  }
}
