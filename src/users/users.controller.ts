/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/enums/role.enum';
import { Auth } from '../common/decorators/auth.decorator';
import { GetUserID } from '../common/decorators/get-user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Auth([Roles.None])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth([Roles.None])
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth([Roles.Admin])
  findOne(@Param('id') id: string, @GetUserID() userId: number) {
    console.log(userId);

    return this.usersService.findOneById(+id);
  }

  @Patch(':id')
  @Auth([Roles.Admin])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('me')
  @Auth([Roles.User])
  updateMe(@GetUserID() id: number, @Body() updateUserDto: UpdateUserDto) {

    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Auth([Roles.Admin, Roles.User])
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
