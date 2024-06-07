import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CurrentUser } from '../auth/currentUser.decorator';
import { UserDto } from '../auth/dto/userDto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
@Roles(Role.User)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@CurrentUser() user: UserDto, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(user, createTodoDto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.todosService.findOne(user, id);
  }

  @Get()
  findAll(@CurrentUser() user: UserDto) {
    return this.todosService.findAll(user);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserDto,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(user, id, updateTodoDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.todosService.remove(user, id);
  }
}
