import { Controller, Post, Body, Get, Param, BadRequestException, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUser(@Request() req: any, @Body() body: CreateUserDto) {
    const caller = req.user;
    if (!caller || !caller.role || caller.role.name !== 'admin') {
      throw new BadRequestException('Only admin can create users');
    }
    if (!body || !body.username || !body.password) {
      throw new BadRequestException('username and password are required');
    }
    return this.usersService.create(body.username, body.password, body.fullName, body.role);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateUser(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const caller = req.user;
    const targetId = +id;
    const isAdmin = caller && caller.role && caller.role.name === 'admin';
    const isOwner = caller && caller.id === targetId;

    if (!isAdmin && !isOwner) {
      throw new BadRequestException('You can only update your own account or be admin');
    }

    return this.usersService.update(targetId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(@Request() req: any, @Param('id') id: string) {
    const caller = req.user;
    const targetId = +id;
    const isAdmin = caller && caller.role && caller.role.name === 'admin';
    const isOwner = caller && caller.id === targetId;

    if (!isAdmin && !isOwner) {
      throw new BadRequestException('You can only delete your own account or be admin');
    }

    return this.usersService.remove(targetId);
  }
}
