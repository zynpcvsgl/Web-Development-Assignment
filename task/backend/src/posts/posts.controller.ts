import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly svc: PostsService) {}

  @Get() findAll(){ return this.svc.findAll() }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number){ return this.svc.findOne(id) }
  @Post() create(@Body() dto: CreatePostDto){ return this.svc.create(dto) }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto){ return this.svc.update(id, dto) }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number){ return this.svc.remove(id) }
}
